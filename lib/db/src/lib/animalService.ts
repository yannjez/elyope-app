import { AnimalSpecies, Prisma, PrismaClient } from '@prisma/client';
import { BaseService } from './_baseService.js';
import {
  AnimalBreed,
  AnimalWithBreed,
  CanDeleteAnimalReason,
  AnimalFull,
} from 'src/type/index.js';

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

  canDeleteAnimal = async (
    structureId: string,
    id: string
  ): Promise<{ canDelete: boolean; reason: CanDeleteAnimalReason }> => {
    //TODO: check if there is exams  or message linked to the animal e

    const reason: CanDeleteAnimalReason = {
      linkedExams: false,
      linkedMessages: false,
    };

    return { canDelete: true, reason };
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
    sort?: 'name' | 'fullBreed' | 'externalRef' | 'birthDate',
    sortDirection?: 'asc' | 'desc',
    search?: string,
    type?: AnimalSpecies,
    locale: 'fr' | 'en' = 'fr'
  ) => {
    const offset = (page - 1) * limit;

    const where = this.buildSearchWhere(structureId, search, type);
    const direction = sortDirection === 'asc' ? 'asc' : 'desc';
    console.log('direction', direction, sort);
    const sortableFields: Record<
      string,
      Prisma.AnimalOrderByWithRelationInput
    > = {
      name: { name: direction },
      fullBreed: { breed: { name: direction } },
      externalRef: { externalRef: direction },
      birthDate: { birthDate: direction },
    };

    const orderBy = sort && sortableFields[sort];
    console.log('orderBy', orderBy);

    const data = (await this.prisma.animal.findMany({
      where,
      include: {
        breed: true,
      },
      skip: offset,
      take: limit,
      orderBy: orderBy,
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
      } as AnimalFull;
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
