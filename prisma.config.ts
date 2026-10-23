import "dotenv/config";
import { defineConfig } from "prisma/config"

// Pakai prisma.config.ts => Prisma tidak auto-load .env, makanya ada dotenv di atas.
// URL database diambil dari schema.prisma (env("DATABASE_URL")).
export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: "prisma/migrations",
  },
})
