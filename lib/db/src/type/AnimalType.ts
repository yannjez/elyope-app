import {
  type AnimalBreed as PrismaAnimalBreed,
  type AnimalSpecies as PrismaAnimalSpecies,
  type Animal as PrismaAnimal,
  type Prisma,
} from '@prisma/client';

export type AnimalBreed = PrismaAnimalBreed;
export type AnimalBreedFull = AnimalBreed & { fullname: string };
export type AnimalSpecies = PrismaAnimalSpecies;
export type Animal = PrismaAnimal;

export type AnimalWithBreed = Prisma.AnimalGetPayload<{
  include: { breed: true };
}>;

export type AnimalFull = AnimalWithBreed & {
  fullBreed: string;
  birthDateOb: Date | null;
};

export type CanDeleteAnimalReason = {
  linkedExams: boolean;
  linkedMessages: boolean;
};

export type AnimalSortField =
  | 'name'
  | 'fullBreed'
  | 'externalRef'
  | 'birthDate';
