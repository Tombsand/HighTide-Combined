## HighTide

Web app untuk mencatat film/anime/donghua yang sudah ditonton atau mau ditonton.

Stack: Vue 3 + Vite + Tailwind (frontend), Hono + Prisma + Postgres Neon (backend, serverless di Vercel).

Lihat **[DEPLOY.md](./DEPLOY.md)** untuk setup & deploy.

```sh
npm install
cp .env.example .env   # isi DATABASE_URL
npm run db:deploy      # bikin tabel
npm run db:import
npm run dev            # vite -> http://localhost:5173 (UI + /api)
```
