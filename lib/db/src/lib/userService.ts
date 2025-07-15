import { PrismaClient } from '@prisma/client';
import { BaseService } from './_baseService.js';
import { ExternalUSer, User, UserType } from '../type/index.js';

export class UserService extends BaseService {
  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  createUpdateUser = async (user: ExternalUSer, userRoleType: UserType) => {
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
          email: user.email,
          externalId: user.id,
          name: user.email.split('@')[0], // Use email prefix as default name
          roles: [userRoleType],
        },
      });
    }
  };

  getUserByExternalId = async (externalId: string) => {
    return (await this.prisma.user.findUnique({
      where: {
        externalId,
      },
    })) as User;
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

    return (await this.prisma.user.findMany({
      skip,
      take,
      where,
      orderBy,
    })) as User[];
  };
}
