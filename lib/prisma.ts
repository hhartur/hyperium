import { PrismaClient } from '@/lib/generated/prisma'

let prisma: PrismaClient

// Verifica se já existe (somente em Node)
if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient()
} else {
  prisma = new PrismaClient()
}

export default prisma
