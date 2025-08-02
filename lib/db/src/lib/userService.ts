import { PrismaClient } from '@prisma/client';
import { BaseService } from './_baseService.js';
import {
  ClerkUser,
  ExternalUSer,
  FullUser,
  User,
  UserType,
} from '../type/index.js';
import { ClerkService, ClerkSortField } from './clerkService.js';

export class UserService extends BaseService {
  clerkService: ClerkService;

  constructor(prisma: PrismaClient) {
    super(prisma);
    this.clerkService = new ClerkService();
  }

  createUpdateUser = async (user?: ClerkUser, userRoleType?: UserType) => {
    if (!user) {
      return null;
    }
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
    return this.mergeClerkData(user, clerkUser || undefined) as FullUser;
  };

  getUserCount = async () => {
    return await this.prisma.user.count();
  };

  getUsers = async (
    page: number,
    limit: number,
    sort?: keyof FullUser,
    sortDirection?: 'asc' | 'desc',
    search?: string
  ) => {
    // pagination
    const offset = (page - 1) * limit;

    const sortMapping: Record<string, ClerkSortField> = {
      fullName: 'first_name',
      // email_address: 'email_address',
      email: 'email_address',
      username: 'username',
      createdAt: '-created_at',
      updatedAt: '-updated_at',
      first_name: 'first_name',
      last_name: 'last_name',
    };

    // map full user to clerk sort field
    const clerkSortField = !sort
      ? 'created_at'
      : (`${sortDirection === 'asc' ? '+' : '-'}${
          sortMapping[sort]
        }` as ClerkSortField);

    const clerkUsers = await this.clerkService.getUsers(
      limit,
      offset,
      clerkSortField,
      search
    );

    const where = {
      externalId: {
        in: clerkUsers.map((user) => user.id),
      },
    };

    const users = (await this.prisma.user.findMany({
      where,
    })) as User[];

    if (users.length === 0) {
      return { data: [] };
    }

    const data = clerkUsers.map((clerkUser) => {
      const user = users.find((user) => user.externalId === clerkUser.id);
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

  mergeClerkData = (user?: User, clerkUser?: ClerkUser) => {
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
        existingClerkUser || createdClerkUser || undefined,
        userRoleType
      );

      return userf;

      // return await this.createUpdateUser(createdClerkUser, userRoleType);
    } catch (error) {
      throw error;
    }
  };
}
