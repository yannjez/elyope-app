import { PrismaClient } from '../../../../dist/.prisma/client/index.js';
import { BaseService } from './_baseService.js';

export class StructureService extends BaseService {
  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  /**
   * Build a Prisma where clause for keyword search across multiple fields
   */
  private buildSearchWhere(keyword?: string) {
    if (!keyword || keyword.trim() === '') {
      return {};
    }
    const query = keyword.trim();
    return {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { address1: { contains: query, mode: 'insensitive' } },
        { address2: { contains: query, mode: 'insensitive' } },
        { zipcode: { contains: query, mode: 'insensitive' } },
        { town: { contains: query, mode: 'insensitive' } },
        { account_email: { contains: query, mode: 'insensitive' } },
      ],
    } as any;
  }

  /**
   * Return count of structures matching optional keyword search
   * Same contract style as UserService.getFilteredUserCount
   */
  getFilteredStructureCount = async (search?: string) => {
    const where = this.buildSearchWhere(search);
    const count = await this.prisma.structure.count({ where: where as any });
    return count;
  };

  /**
   * List structures with pagination, sorting and keyword search
   * Same contract style as UserService.getUsers
   */
  getStructures = async (
    page: number,
    limit: number,
    sort?: string,
    sortDirection?: string,
    search?: string
  ) => {
    const offset = (page - 1) * limit;

    // Allowed sort fields mapping
    const sortableFields: Record<string, 'name' | 'town' | 'zipcode'> = {
      name: 'name',
      town: 'town',
      zipcode: 'zipcode',
    };

    const where = this.buildSearchWhere(search);

    // Default order: createdAt desc
    const direction: 'asc' | 'desc' = sortDirection === 'asc' ? 'asc' : 'desc';
    const orderBy =
      sort && sortableFields[sort]
        ? { [sortableFields[sort]]: direction }
        : { createdAt: 'desc' };

    const data = await this.prisma.structure.findMany({
      where: where as any,
      orderBy: orderBy as any,
      skip: offset,
      take: limit,
    });

    return { data };
  };

  /**
   * Create a new structure
   */
  createStructure = async (input: {
    name: string;
    description?: string | null;
    address1?: string | null;
    address2?: string | null;
    zipcode?: string | null;
    town?: string | null;
    phone?: string | null;
    mobile?: string | null;
    account_lastname?: string | null;
    account_firstname?: string | null;
    account_email?: string | null;
    interpreterId?: string | null;
  }) => {
    const created = await this.prisma.structure.create({
      data: {
        name: input.name,
        description: input.description ?? null,
        address1: input.address1 ?? null,
        address2: input.address2 ?? null,
        zipcode: input.zipcode ?? null,
        town: input.town ?? null,
        phone: input.phone ?? null,
        mobile: input.mobile ?? null,
        account_lastname: input.account_lastname ?? null,
        account_firstname: input.account_firstname ?? null,
        account_email: input.account_email ?? null,
        interpreterId: input.interpreterId ?? null,
      },
    });
    return created;
  };

  /**
   * Delete a structure and its memberships
   */
  deleteStructure = async (id: string) => {
    // Remove members
    await this.prisma.structureUser.deleteMany({ where: { structureId: id } });
    // Delete structure
    return await this.prisma.structure.delete({ where: { id } });
  };

  /**
   * Add a user (by internal userId) as a member of a structure
   */
  addUserToStructure = async (structureId: string, userId: string) => {
    // Ensure structure exists
    const structure = await this.prisma.structure.findUnique({
      where: { id: structureId },
      select: { id: true },
    });
    if (!structure) {
      throw new Error('Structure not found');
    }

    // Ensure user exists
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });
    if (!user) {
      throw new Error('User not found');
    }

    // Avoid duplicate membership
    const existing = await this.prisma.structureUser.findFirst({
      where: { structureId, userId },
      select: { id: true },
    });
    if (existing) {
      return existing;
    }

    const membership = await this.prisma.structureUser.create({
      data: { structureId, userId },
    });
    return membership;
  };

  /**
   * Convenience: add a user to a structure using the user's externalId
   */
  addUserToStructureByExternalId = async (
    structureId: string,
    userExternalId: string
  ) => {
    const user = await this.prisma.user.findUnique({
      where: { externalId: userExternalId },
      select: { id: true },
    });
    if (!user) {
      throw new Error('User not found');
    }
    return this.addUserToStructure(structureId, user.id);
  };

  /**
   * Remove a user (by internal userId) from a structure
   */
  removeUserFromStructure = async (structureId: string, userId: string) => {
    const membership = await this.prisma.structureUser.findFirst({
      where: { structureId, userId },
      select: { id: true },
    });
    if (!membership) {
      throw new Error('Membership not found');
    }
    const deleted = await this.prisma.structureUser.delete({
      where: { id: membership.id },
    });
    return deleted;
  };

  /**
   * Convenience: remove a user from a structure using the user's externalId
   */
  removeUserFromStructureByExternalId = async (
    structureId: string,
    userExternalId: string
  ) => {
    const user = await this.prisma.user.findUnique({
      where: { externalId: userExternalId },
      select: { id: true },
    });
    if (!user) {
      throw new Error('User not found');
    }
    return this.removeUserFromStructure(structureId, user.id);
  };

  async getStructureById(id: string) {
    return this.prisma.structure.findUnique({
      where: { id },
      include: {
        Interpreter: true,
        Members: {
          include: {
            user: true,
          },
        },
      },
    });
  }
}
