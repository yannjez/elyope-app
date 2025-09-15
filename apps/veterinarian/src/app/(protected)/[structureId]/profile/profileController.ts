'use server';

import { prisma } from '@/db';
import { StructureService } from '@elyope/db';

export async function getStructureById(id: string) {
  const structureService = new StructureService(prisma);
  return structureService.getStructureById(id);
}
