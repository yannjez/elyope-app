'use server';

import { UserService, ExternalUSer } from '@elyope/db';
import { prisma } from '@/db';
import { ListRequestType } from '@elyope/db';

export const getUserList = async (listRequest?: ListRequestType) => {
  console.log('listRequest', listRequest);
  const userService = new UserService(prisma);

  const { page, sort, sortDirection, search, role } = listRequest || {};

  // Get filtered user count for proper pagination
  const filteredUserCount = await userService.getFilteredUserCount(
    search,
    role
  );
  const pagination = userService.getPaginationInfo(filteredUserCount);

  if (page && page > pagination.totalPages) {
    return {
      data: [],
      pagination,
    };
  }

  const response = await userService.getUsers(
    page || 1,
    userService.listLimit,
    sort,
    sortDirection,
    search,
    role
  );
  const { data } = response;

  return {
    data: data || [],
    pagination,
  };
};

export const createUser = async (user: ExternalUSer) => {
  const userService = new UserService(prisma);
  return await userService.createUser(user, 'VETERINARIAN');
};

export const deleteUser = async (id: string) => {
  const userService = new UserService(prisma);
  return await userService.deleteUser(id);
};
