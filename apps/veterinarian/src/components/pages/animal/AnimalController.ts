'use server';

import { prisma } from '@/db';
import { AnimalResquest } from '@/types/animals';
import { Animal, AnimalBreed, AnimalService, PaginationInfo } from '@elyope/db';

export const getAnimalBreeds = async (): Promise<AnimalBreed[]> => {
  const animalService = new AnimalService(prisma);
  return await animalService.getAnimalBreedList();
};

export const getInitialAnimals = async (
  request: AnimalResquest
): Promise<{ data: Animal[]; pagination: PaginationInfo }> => {
  const animalService = new AnimalService(prisma);

  const [filteredAnimalCount, data] = await Promise.all([
    animalService.getFilteredAnimalCount(request.search, request.type),
    animalService.getAnimals(1, 10, 'name', 'asc', '', request.type),
  ]);

  const pagination = animalService.getPaginationInfo(filteredAnimalCount);
  return {
    data,
    pagination,
  };
};
