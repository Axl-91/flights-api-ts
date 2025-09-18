import { PrismaClient } from '../generated/prisma/client'

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn'],
});

export default prisma;
