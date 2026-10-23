import 'dotenv/config'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

// Dev only: jalanin Hono API (server/app.ts) di port yang sama dengan Vite.
// Di Vercel, /api/* ditangani api/index.ts.
const honoDevApi = () => ({
  name: 'hono-dev-api',
  apply: 'serve',
  configureServer(server) {
    server.middlewares.use(async (req, res, next) => {
      if (req.url !== '/api' && !req.url?.startsWith('/api/')) return next()
      try {
        const { getRequestListener } = await import('@hono/node-server')
        const { default: app } = await server.ssrLoadModule('/server/app.ts')
        await getRequestListener(app.fetch)(req, res)
      } catch (err) {
        server.ssrFixStacktrace(err)
        next(err)
      }
    })
  },
})

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    honoDevApi()
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
