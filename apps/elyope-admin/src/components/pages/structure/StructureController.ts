'use server';

import { StructureService, UserService } from '@elyope/db';
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
  return await structureService.updateStructure(id, input);
};

export const deleteStructure = async (id: string) => {
  const structureService = new StructureService(prisma);
  return await structureService.deleteStructure(id);
};

export const addStructureMember = async (
  structureId: string,
  userId: string
) => {
  const structureService = new StructureService(prisma);

  return await structureService.addUserToStructure(structureId, userId);
};

export const getStructureMembers = async (structureId: string) => {
  const userService = new UserService(prisma);
  return await userService.getStructureMembers(structureId);
};

export const removeStructureMember = async (
  structureId: string,
  userExternalId: string
) => {
  const structureService = new StructureService(prisma);
  return await structureService.removeUserFromStructureByExternalId(
    structureId,
    userExternalId
  );
};

export const getInterpreters = async () => {
  const userService = new UserService(prisma);
  return await userService.getUsers(
    1,
    1000,
    'fullName',
    'asc',
    '',
    'INTERPRETER'
  );
};
