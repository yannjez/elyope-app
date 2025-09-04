import { Animal, AnimalSpecies, Prisma, PrismaClient } from '@prisma/client';
import { BaseService } from './_baseService.js';
import { AnimalBreed } from 'src/type/index.js';

export class AnimalService extends BaseService {
  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  getAnimalBreedList = async (type?: AnimalSpecies, addIsArchived = false) => {
    const where: Prisma.AnimalBreedWhereInput = {};
    if (type) {
      where.species = type;
    }
    if (!addIsArchived) {
      where.isArchived = false;
    }

    return (await this.prisma.animalBreed.findMany({ where })) as AnimalBreed[];
  };

  getAnimals = async (
    page: number,
    limit: number,
    sort?: 'name' | 'breed',
    sortDirection?: 'asc' | 'desc',
    search?: string,
    type?: AnimalSpecies
  ) => {
    const offset = (page - 1) * limit;

    const where = this.buildSearchWhere(search, type);

    const sortableFields: Record<string, 'name' | 'breed.name'> = {
      name: 'name',
      breed: 'breed.name',
    };

    const direction = sortDirection === 'asc' ? 'asc' : 'desc';
    const orderBy =
      sort && sortableFields[sort]
        ? { [sortableFields[sort]]: direction }
        : { createdAt: 'desc' };

    return (await this.prisma.animal.findMany({
      where,
      include: {
        breed: true,
      },
      skip: offset,
      take: limit,
      orderBy: orderBy as Prisma.AnimalOrderByWithRelationInput,
    })) as Animal[];
  };

  /**
   * Return count of structures matching optional keyword search
   * Same contract style as UserService.getFilteredUserCount
   */
  getFilteredAnimalCount = async (search?: string, type?: AnimalSpecies) => {
    const where = this.buildSearchWhere(search, type);
    const count = await this.prisma.animal.count({
      where: where as Prisma.AnimalWhereInput,
    });
    return count;
  };

  /**
   * Build a Prisma where clause for keyword search across multiple fields
   */
  private buildSearchWhere(keyword?: string, type?: AnimalSpecies) {
    if (!keyword || (keyword.trim() === '' && !type)) {
      return {};
    }
    const where: Prisma.AnimalWhereInput = {};
    if (type) {
      where.species = type;
    }
    if (keyword) {
      const query = keyword.trim();
      where.OR = [
        { name: { contains: query, mode: 'insensitive' } },
        { breed: { name: { contains: query, mode: 'insensitive' } } },
      ];
    }
    return where;
  }
}
