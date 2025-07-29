import { PrismaClient } from '@prisma/client';
import { BaseService } from './_baseService.js';
import {
  ClerkUser,
  ExternalUSer,
  FullUser,
  User,
  UserType,
} from '../type/index.js';
import { ClerkService } from './clerkService.js';

export class UserService extends BaseService {
  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  createUpdateUser = async (user: ClerkUser, userRoleType: UserType) => {
    // First, try to find the existing user
    const existingUser = await this.prisma.user.findUnique({
      where: {
        externalId: user.id,
      },
      select: {
        id: true,
        roles: true,
      },
    });

    if (existingUser) {
      // User exists, check if they already have the role
      const hasRole = existingUser.roles.includes(userRoleType as any);

      if (!hasRole) {
        // User doesn't have this role, add it
        return await this.prisma.user.update({
          where: {
            externalId: user.id,
          },
          data: {
            roles: {
              push: userRoleType,
            },
          },
        });
      }
    } else {
      // User doesn't exist, create new user
      return await this.prisma.user.create({
        data: {
          externalId: user.id,
          roles: [userRoleType],
        },
      });
    }
  };

  getUserByExternalId = async (externalId: string) => {
    const user = (await this.prisma.user.findUnique({
      where: {
        externalId,
      },
    })) as User;
    const clerkService = new ClerkService();
    const clerkUser = await clerkService.getUserByID(externalId);
    return this.mergeClerkData(user, clerkUser) as FullUser;
  };

  getUserCount = async () => {
    return await this.prisma.user.count();
  };

  getUsers = async (
    page: number,
    limit: number,
    sort?: string,
    sortDirection?: string,
    search?: string
  ) => {
    // pagination
    const skip = (page - 1) * limit;
    const take = limit;

    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};

    const orderBy = sort ? { [sort]: sortDirection } : {};

    const users = (await this.prisma.user.findMany({
      skip,
      take,
      where,
      orderBy,
    })) as User[];

    if (users.length === 0) {
      return { data: [] };
    }

    // Get the clerk Data

    const clerkService = new ClerkService();
    const clerkUsers = await clerkService.getUsersByIDs(
      users.map((user) => user.externalId)
    );

    const data = users.map((user) => {
      const clerkUser = clerkUsers.find(
        (clerkUser) => clerkUser.id === user.externalId
      );
      return this.mergeClerkData(user, clerkUser) as FullUser;
    });

    return {
      data,
      pagination: {
        total: users.length,
        page,
        limit,
        totalPages: Math.ceil(users.length / limit),
      },
    };
  };

  mergeClerkData = (user: User, clerkUser?: ClerkUser) => {
    return {
      ...user,
      ...clerkUser,
      fullName: clerkUser?.first_name + ' ' + clerkUser?.last_name,
      email: clerkUser?.email_addresses?.at(0)?.email_address || '',
    } as FullUser;
  };

  createUser = async (user: ExternalUSer, userRoleType: UserType) => {
    // check if clerk user already exist
    const clerkService = new ClerkService();
    const existingClerkUser = await clerkService.getUserByEmail(user.email);

    try {
      let createdClerkUser: ClerkUser | null = null;
      if (!existingClerkUser) {
        createdClerkUser = await clerkService.createUser(user);
      }
      // create the user or update it's role
      const userf = await this.createUpdateUser(
        existingClerkUser || createdClerkUser,
        userRoleType
      );

      // if (createdClerkUser) {
      //   const response = await clerkService.inviteUser(user.email);
      //   console.log('response', response);
      // }
      return userf;

      // return await this.createUpdateUser(createdClerkUser, userRoleType);
    } catch (error) {
      console.error('Error creating user', error);
      return null;
    }
  };
}
