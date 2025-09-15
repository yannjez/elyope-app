/* eslint-disable @nx/enforce-module-boundaries */
// libs/db/src/db.ts
export const runtime = 'nodejs';

import { PrismaClient } from '@elyope/db';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma: PrismaClient =
  globalForPrisma.prisma ?? new PrismaClient();
export type { PrismaClient };
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
