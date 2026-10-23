# High Tide — Deploy ke Vercel (1 project, frontend + backend, 1 domain)

Arsitektur:

```
https://namaproject.vercel.app/        -> Vue (Vite) static  (src/, dist/)
https://namaproject.vercel.app/api/film -> Hono API           (api/index.ts -> server/app.ts)
                                        -> Postgres Neon      (DATABASE_URL)
```

Frontend & backend satu origin, jadi:
- Cuma 1 domain / 1 port. Gak perlu CORS, gak perlu buka port tambahan.
- `VITE_API_BASE_URL_BACKEND="/api/film"` (path relatif).

---

## 0. Prasyarat

- Node.js 20+ (`node -v`)
- Akun GitHub, Vercel, Neon (login pakai GitHub aja biar gampang)
- Git terinstall

---

## 1. Setup database gratis (Neon Postgres)

Kenapa bukan SQLite: Vercel itu serverless, filesystem-nya read-only dan tidak persisten. File `data.db` gak bisa dipakai buat nulis data. Jadi pindah ke Postgres.

Pilihan gratis lain (kalau mau): Supabase (free, auto-pause kalau nganggur 7 hari), Prisma Postgres, Turso (SQLite-compatible, butuh adapter libsql).

Langkah Neon:
1. Buka https://neon.tech → **Sign up with GitHub**.
2. **Create project** → nama bebas, region terdekat (Singapore kalau ada).
3. Di dashboard, klik **Connection Details** → copy connection string. Format:
   ```
   postgresql://USER:PASSWORD@ep-xxxx-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
   ```
   Simpan, ini `DATABASE_URL`.

Alternatif: di Vercel dashboard → **Storage** → **Marketplace** → Neon. Ini otomatis inject env var ke project Vercel (gak perlu copy manual).

---

## 2. Setup lokal

```bash
cd high-tide
cp .env.example .env
```

Edit `.env`, isi `DATABASE_URL` dari Neon. Biarkan `VITE_API_BASE_URL_BACKEND="/api/film"`.

```bash
npm install          # otomatis prisma generate (postinstall)
npm run db:deploy    # bikin tabel "film" dari prisma/migrations
npm run db:import    # import 27 data dari SQLite lama (sekali aja)
npm run dev          # http://localhost:5173  (UI + /api di port yang sama)
```

Gak perlu Vercel CLI buat dev lokal. API (`server/app.ts`) di-mount langsung ke dev server Vite
lewat plugin di `vite.config.js`, jadi tetap 1 port.

Cek API: buka `http://localhost:5173/api/film` → harusnya JSON `success: true`.

> JANGAN pakai `vercel dev` untuk project ini. Rewrite SPA di `vercel.json` bikin request modul Vite
> (`/@vite/client`, dll) dilempar ke `index.html` → error
> `Failed to parse source for import analysis ... index.html`.

---

## 3. Push ke GitHub

```bash
git init
git add .
git commit -m "feat: merge frontend + backend, ready for vercel"
git branch -M main
git remote add origin https://github.com/USERNAME/high-tide.git
git push -u origin main
```

Pastikan `.env` TIDAK ikut ke-push (sudah ada di `.gitignore`).

---

## 4. Deploy ke Vercel

1. https://vercel.com/new → **Import** repo `high-tide`.
2. Framework: otomatis **Vite**. Build command & output dir sudah diatur di `vercel.json`
   (`npm run build` → `dist`). Jangan diubah.
3. Buka **Environment Variables**, tambah:

   | Name | Value |
   |---|---|
   | `DATABASE_URL` | connection string Neon (pooled) |
   | `VITE_API_BASE_URL_BACKEND` | `/api/film` |

4. Klik **Deploy**. Tunggu ±1–2 menit.

---

## 5. Isi database production

Kalau lokal dan production pakai DB Neon yang sama, data sudah ada (langkah 2). Kalau mau DB terpisah untuk production:

```bash
DATABASE_URL="<url-prod>" npm run db:deploy   # apply migration
DATABASE_URL="<url-prod>" npm run db:import   # import data (jalankan sekali aja)
```

> Catatan: Neon pooled URL kadang error saat `migrate`. Kalau kena, pakai connection string **non-pooled** (tanpa `-pooler` di host) khusus untuk perintah `prisma migrate`.

---

## 6. Test

- `https://PROJECT.vercel.app/` → UI
- `https://PROJECT.vercel.app/api/film` → JSON list film
- `https://PROJECT.vercel.app/api/film/anime` & `/donghua` → filter

Setiap ganti `VITE_*` env var, WAJIB redeploy (Vite nge-bake env saat build).

---

## Update selanjutnya

```bash
git add . && git commit -m "..." && git push
```
Vercel auto-deploy tiap push ke `main`.

---

## Troubleshooting

| Gejala | Penyebab / Solusi |
|---|---|
| `/api/*` 404 | Pastikan file `api/index.ts` ada di ROOT project (bukan di dalam `src/`) dan rewrite `/api/(.*)` → `/api` ada di `vercel.json`. |
| `ERR_MODULE_NOT_FOUND` di log function | Import relatif di `api/`, `server/`, `prisma/client/` wajib pakai ekstensi `.js` (karena `"type": "module"`). |
| `Failed to parse source for import analysis ... index.html` | Kamu jalanin `vercel dev`. Pakai `npm run dev` (Vite). |
| `FUNCTION_PAYLOAD_TOO_LARGE` | Request/response function Vercel max 4.5 MB. Gambar disimpan base64 di DB, `GET /api/film` sekarang ±2.8 MB. Kecilkan gambar sebelum upload. |
| `PrismaClientInitializationError` / `DATABASE_URL` not found | Env var belum diisi di Vercel. Isi lalu **Redeploy**. |
| Error engine Prisma `rhel-openssl` / `libquery_engine` | `binaryTargets = ["native", "rhel-openssl-3.0.x"]` sudah ada di `prisma/schema.prisma`. Pastikan `npm run build` (ada `prisma generate`) yang dipakai di Vercel. |
| Data frontend kosong | Cek `VITE_API_BASE_URL_BACKEND` = `/api/film` (tanpa domain, tanpa trailing slash). |
| Halaman refresh di `/anime` 404 | Cek `vercel.json` (rewrite SPA ke `/index.html`). |
| Insert baru error "Unique constraint id" | Jalankan ulang `npm run db:import` (sudah sync sequence). |
| `The table public.film does not exist` | Belum migrate. Jalankan `npm run db:deploy`. |

---

## Catatan keamanan

Endpoint `POST`, `PATCH`, `DELETE` di `/api/film` sekarang PUBLIK, siapa aja bisa ubah/hapus data.
Sebelum share ke orang banyak, tambah auth (mis. API key di header, atau Clerk/Auth.js).
