// Import data dari SQLite lama (prisma/data/films.json) ke Postgres.
// Jalankan sekali: npm run db:import
import 'dotenv/config'
import { readFileSync } from 'node:fs'
import { prisma } from '../prisma/client/index.js'

const films = JSON.parse(readFileSync('prisma/data/films.json', 'utf-8'))

const result = await prisma.film.createMany({ data: films, skipDuplicates: true })
console.log(`inserted: ${result.count} / ${films.length}`)

// Sinkronkan sequence id supaya insert baru tidak bentrok dengan id hasil import.
await prisma.$executeRawUnsafe(
  `SELECT setval(pg_get_serial_sequence('film', 'id'), COALESCE((SELECT MAX(id) FROM film), 1))`
)
console.log('sequence synced')

await prisma.$disconnect()
