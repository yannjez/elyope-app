'use server';

import { UserService } from '@elyope/db';
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

  return {
    data: response,
    pagination,
  };
};
