import { PrismaClient } from '@prisma/client';
import { BaseService } from './_baseService.js';
import { ExternalUSer, UserType } from '../type/index.js';

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
}
