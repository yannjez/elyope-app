'use server';

import { StructureService } from '@elyope/db';
import { prisma } from '../../../db';

export async function getStructureById(id: string) {
  const structureService = new StructureService(prisma);
  return structureService.getStructureById(id);
}
