import { PrismaClient } from '@prisma/client'

// Reuse 1 instance (penting di dev: Vite reload modul tiap ada perubahan).
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
