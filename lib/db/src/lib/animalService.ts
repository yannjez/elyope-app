import {
  AnimalSpecies,
  AnimalWithBreed,
  Prisma,
  PrismaClient,
} from '@prisma/client';
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

  deleteAnimal = async (structureId: string, id: string) => {
    const animal = await this.prisma.animal.findFirst({
      where: { id: id, structureId: structureId },
    });

    if (!animal) {
      throw new Error('Animal not found');
    }

    await this.prisma.animal.delete({
      where: { id: id },
    });
  };

  getAnimals = async (
    structureId: string,
    page: number,
    limit: number,
    sort?: 'name' | 'breed',
    sortDirection?: 'asc' | 'desc',
    search?: string,
    type?: AnimalSpecies,
    locale: 'fr' | 'en' = 'fr'
  ) => {
    const offset = (page - 1) * limit;

    console.log('structureId', structureId);
    console.log('search', search);
    console.log('type', type);
    const where = this.buildSearchWhere(structureId, search, type);

    const sortableFields: Record<string, 'name' | 'breed.name'> = {
      name: 'name',
      breed: 'breed.name',
    };

    const direction = sortDirection === 'asc' ? 'asc' : 'desc';
    const orderBy =
      sort && sortableFields[sort]
        ? { [sortableFields[sort]]: direction }
        : { createdAt: 'desc' };

    const data = (await this.prisma.animal.findMany({
      where,
      include: {
        breed: true,
      },
      skip: offset,
      take: limit,
      orderBy: orderBy as Prisma.AnimalOrderByWithRelationInput,
    })) as AnimalWithBreed[];

    return data.map((animal) => {
      let species =
        animal.breed.species === AnimalSpecies.CHAT ? 'Cat >' : 'Dog >';
      if (locale === 'fr') {
        species =
          animal.breed.species === AnimalSpecies.CHAT ? 'Chat >' : 'Chien >';
      }
      return {
        ...animal,
        fullBreed: `${species}  ${
          locale === 'fr' ? animal.breed.name_fr : animal.breed.name
        }`,
      };
    });
  };

  /**
   * Return count of structures matching optional keyword search
   * Same contract style as UserService.getFilteredUserCount
   */
  getFilteredAnimalCount = async (
    structureId?: string,
    search?: string,
    type?: AnimalSpecies
  ) => {
    const where = this.buildSearchWhere(structureId, search, type);
    const count = await this.prisma.animal.count({
      where: where as Prisma.AnimalWhereInput,
    });
    return count;
  };

  /**
   * Build a Prisma where clause for keyword search across multiple fields
   */
  private buildSearchWhere(
    structureId?: string,
    keyword?: string,
    type?: AnimalSpecies
  ) {
    const where = {
      structureId: structureId,
    } as Prisma.AnimalWhereInput;

    if (type) {
      where.species = type;
    }
    const query = keyword?.trim();
    if (query) {
      where.OR = [
        { name: { contains: query, mode: 'insensitive' } },
        { breed: { name: { contains: query, mode: 'insensitive' } } },
        { comment: { contains: query, mode: 'insensitive' } },
      ];
    }
    return where;
  }
}
