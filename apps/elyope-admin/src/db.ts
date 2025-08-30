import { PrismaClient } from '@elyope/db';

const globalForPrisma = globalThis as {
  prisma?: PrismaClient;
};

export const prisma: PrismaClient =
  globalForPrisma.prisma ?? new PrismaClient();
export type { PrismaClient };
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
