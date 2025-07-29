'use server';

import { UserService, ExternalUSer } from '@elyope/db';
import { prisma } from '@/db';
import { ListRequestType } from '@elyope/db';

export const getUserList = async (listRequest?: ListRequestType) => {
  const userService = new UserService(prisma);

  const userCount = await userService.getUserCount();
  const pagination = userService.getPaginationInfo(userCount);

  const { page, sort, sortDirection, search } = listRequest || {};

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
    search
  );
  const { data } = response;

  return {
    data,
    pagination,
  };
};

export const createUser = async (user: ExternalUSer) => {
  const userService = new UserService(prisma);
  return await userService.createUser(user, 'VETERINARIAN');
};
