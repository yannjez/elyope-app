import { PrismaClient } from '../../../../dist/.prisma/client/index.js';
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
      // User already has the role, return the existing user
      return existingUser;
    } else {
      // User doesn't exist, create new user
      return await this.prisma.user.create({
        data: {
          externalId: user.id,
          roles: [userRoleType as UserType],
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

  getFilteredUserCount = async (search?: string, role?: string) => {
    // If no filters, return total count
    if (!search && !role) {
      return await this.prisma.user.count();
    }

    // If role filter is applied, get users with that role
    let externalIds: string[] = [];
    if (role && role !== '') {
      const users = await this.prisma.user.findMany({
        where: {
          roles: {
            has: role as UserType,
          },
        },
        select: {
          externalId: true,
        },
      });
      externalIds = users.map(
        (user: { externalId: string }) => user.externalId
      );

      if (externalIds.length === 0) {
        return 0;
      }
    }

    // Get all users from Clerk with search filter
    const allClerkUsers = await this.clerkService.getUsers(
      500, // Get a large number to get all filtered users
      0,
      undefined,
      search,
      externalIds
    );

    // If we have role filter, filter by external IDs
    if (externalIds.length > 0) {
      return allClerkUsers.filter((user) => externalIds.includes(user.id))
        .length;
    }

    return allClerkUsers.length;
  };

  getUsers = async (
    page: number,
    limit: number,
    sort?: string,
    sortDirection?: string,
    search?: string,
    role?: string
  ) => {
    // await this. createUSerWithClerk();
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

    // if a role is provide , we first have to find the external id of the users with that role
    let externalIds: string[] = [];
    if (role && role !== '') {
      const users = await this.prisma.user.findMany({
        where: {
          roles: {
            has: role as UserType,
          },
        },
        select: {
          externalId: true,
        },
      });
      externalIds = users.map(
        (user: { externalId: string }) => user.externalId
      );

      if (externalIds.length === 0) {
        return {
          data: [],
        };
      }
    }

    console.log('externalIds', role, externalIds);

    // map full user to clerk sort field
    const clerkSortField = !sort
      ? '-created_at'
      : (`${sortDirection === 'asc' ? '+' : '-'}${
          sortMapping[sort]
        }` as ClerkSortField);

    const clerkUsers = await this.clerkService.getUsers(
      limit,
      offset,
      clerkSortField,
      search,
      externalIds
    );

    const where: any = {
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
    };
  };

  createUSerWithClerk = async () => {
    const clerkService = new ClerkService();
    const existingClerkUser = await clerkService.getUsers(
      100,
      0,
      '-created_at',
      ''
    );

    const prismaUsers = await this.prisma.user.findMany({
      where: {
        externalId: {
          in: existingClerkUser.map((user) => user.id),
        },
      },
    });

    // get not created user
    const notCreatedUsers = existingClerkUser.filter(
      (user) =>
        !prismaUsers.some((prismaUser) => prismaUser.externalId === user.id)
    );

    if (notCreatedUsers.length > 0) {
      // create the user or update it's role
      await Promise.all(
        notCreatedUsers.map(async (user) => {
          return await this.createUpdateUser(user, 'VETERINARIAN');
        })
      );
      return {
        message: 'Users created',
      };
    }

    return {
      message: 'No users to create',
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

  deleteUser = async (id: string) => {
    const user = await this.prisma.user.findUnique({
      where: {
        externalId: id,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }
    await this.clerkService.deleteUserByID(id);
    await this.prisma.user.delete({
      where: {
        id: user.id,
      },
    });

    return user;
  };
}
