/* eslint-disable @nx/enforce-module-boundaries */
// libs/db/src/db.ts
import { PrismaClient } from '@elyope/db';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma: PrismaClient =
  globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
