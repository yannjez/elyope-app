import { AnimalSpecies, Prisma, PrismaClient } from '@prisma/client';
import { BaseService } from './_baseService.js';
import {
  AnimalBreed,
  AnimalWithBreed,
  CanDeleteAnimalReason,
  AnimalFull,
  AnimalSortField,
  AnimalBreedFull,
} from '../type/index.js';

export class AnimalService extends BaseService {
  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  getAnimalBreedList = async (
    type?: AnimalSpecies,
    addIsArchived = false,
    locale: 'fr' | 'en' = 'fr'
  ) => {
    const where: Prisma.AnimalBreedWhereInput = {};
    if (type) {
      where.species = type;
    }
    if (!addIsArchived) {
      where.isArchived = false;
    }

    const orderBy: Prisma.AnimalBreedOrderByWithRelationInput =
      locale === 'fr' ? { name: 'asc' } : { name_fr: 'asc' };

    const breeds = (await this.prisma.animalBreed.findMany({
      where,
      orderBy,
    })) as AnimalBreed[];
    return breeds.map((breed) => {
      let species = breed.species === AnimalSpecies.CHAT ? 'Cat >' : 'Dog >';
      if (locale === 'fr') {
        species = breed.species === AnimalSpecies.CHAT ? 'Chat >' : 'Chien >';
      }
      return {
        ...breed,
        fullname: `${species} ${locale === 'fr' ? breed.name_fr : breed.name}`,
      } as AnimalBreedFull;
    });
  };

  canDeleteAnimal = async (
    _structureId: string,
    _id: string
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

  createAnimal = async (input: {
    name: string;
    species: AnimalSpecies;
    breedId: string;
    structureId: string;
    externalRef?: string | null;
    birthDate?: Date | null;
    comment?: string | null;
  }) => {
    return await this.prisma.animal.create({
      data: {
        name: input.name,
        species: input.species,
        breedId: input.breedId,
        structureId: input.structureId,
        externalRef: input.externalRef,
        birthDate: input.birthDate,
        comment: input.comment,
      },
      include: {
        breed: true,
      },
    });
  };

  updateAnimal = async (
    id: string,
    input: {
      name?: string;
      species?: AnimalSpecies;
      breedId?: string;
      externalRef?: string | null;
      birthDate?: Date | null;
      comment?: string | null;
    }
  ) => {
    return await this.prisma.animal.update({
      where: { id },
      data: input,
      include: {
        breed: true,
      },
    });
  };

  getAnimalById = async (
    id: string,
    structureId: string,
    locale: 'fr' | 'en' = 'fr'
  ) => {
    const data = await this.prisma.animal.findFirst({
      where: { id, structureId },
      include: {
        breed: true,
      },
    });
    return this.postprocessAnimal(data as AnimalWithBreed, locale);
  };

  getAnimals = async (
    structureId: string,
    page: number,
    limit: number,
    sort?: AnimalSortField,
    sortDirection?: 'asc' | 'desc',
    search?: string,
    type?: AnimalSpecies,
    locale: 'fr' | 'en' = 'fr'
  ) => {
    const offset = (page - 1) * limit;

    const where = this.buildSearchWhere(structureId, search, type);
    const direction = sortDirection === 'asc' ? 'asc' : 'desc';
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
      return this.postprocessAnimal(animal, locale);
    });
  };

  postprocessAnimal = (animal: AnimalWithBreed, locale: 'fr' | 'en' = 'fr') => {
    console.log(
      'animal',
      animal,
      animal.birthDate ? new Date(animal.birthDate) : null
    );

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
      birthDateOb: animal.birthDate ? new Date(animal.birthDate) : null,
    } as AnimalFull;
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
