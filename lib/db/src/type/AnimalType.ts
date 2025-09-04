import {
  AnimalBreed as PrismaAnimalBreed,
  AnimalSpecies as PrismaAnimalSpecies,
  Animal as PrismaAnimal,
} from '@prisma/client';

export type AnimalBreed = PrismaAnimalBreed;
export type AnimalSpecies = PrismaAnimalSpecies;
export type Animal = PrismaAnimal;
export type AnimalGrid = PrismaAnimal & { breed: AnimalBreed };
