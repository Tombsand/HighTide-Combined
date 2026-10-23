// Vercel serverless entry: semua request /api/* di-rewrite ke sini (lihat vercel.json).
// Import wajib pakai .js karena package.json "type": "module".
import app from '../server/app.js'

export default app
