'use server';

import { StructureService } from '@elyope/db';
import { prisma } from '@/db';
import { ListRequestType } from '@elyope/db';

export const getStructureList = async (listRequest?: ListRequestType) => {
  const structureService = new StructureService(prisma);

  const { page, sort, sortDirection, search } = listRequest || {};

  const filteredCount = await structureService.getFilteredStructureCount(
    search
  );
  const pagination = structureService.getPaginationInfo(filteredCount);

  if (page && page > pagination.totalPages) {
    return {
      data: [],
      pagination,
    };
  }

  const response = await structureService.getStructures(
    page || 1,
    structureService.listLimit,
    sort,
    sortDirection,
    search
  );

  const { data } = response;

  return {
    data: data || [],
    pagination,
  };
};

export type CreateStructureInput = {
  name: string;
  description?: string | null;
  address1?: string | null;
  address2?: string | null;
  zipcode?: string | null;
  town?: string | null;
  account_email?: string | null;
};

export const createStructure = async (input: CreateStructureInput) => {
  const structureService = new StructureService(prisma);
  return await structureService.createStructure(input);
};

export const getStructureById = async (id: string) => {
  const structureService = new StructureService(prisma);
  return await structureService.getStructureById(id);
};

export const updateStructure = async (
  id: string,
  input: Partial<CreateStructureInput>
) => {
  const structureService = new StructureService(prisma);
  return await structureService.prisma.structure.update({
    where: { id },
    data: input as any,
  });
};

export const deleteStructure = async (id: string) => {
  const structureService = new StructureService(prisma);
  return await structureService.deleteStructure(id);
};
