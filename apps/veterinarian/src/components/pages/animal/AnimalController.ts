'use server';

import { prisma } from '@/db';
import { AnimalResquest } from '@/types/animals';
import { Animal, AnimalBreed, AnimalService, PaginationInfo, CanDeleteAnimalReason } from '@elyope/db';
import { getLocale } from 'next-intl/server';

export const getAnimalBreeds = async (): Promise<AnimalBreed[]> => {
  const animalService = new AnimalService(prisma);
  return await animalService.getAnimalBreedList();
};

export const canDeleteAnimal = async (structureId: string, id: string): Promise<{ canDelete: boolean; reason: CanDeleteAnimalReason }> => {
  const animalService = new AnimalService(prisma);
  return await animalService.canDeleteAnimal(structureId, id);
};

export const deleteAnimal = async (structureId: string, id: string) => {
  const animalService = new AnimalService(prisma);
  return await animalService.deleteAnimal(structureId, id);
};

export const getAnimals = async (
  request: AnimalResquest
): Promise<{ data: Animal[]; pagination: PaginationInfo }> => {
  const locale = await getLocale();

  const animalService = new AnimalService(prisma);
  const data = await animalService.getAnimals(
    request.structureId,
    request.page || 1,
    animalService.listLimit,
    request.sort as 'name' | 'breed' | undefined,
    request.sortDirection as 'asc' | 'desc' | undefined,
    request.search,
    request.type,
    locale?.includes('fr') ? 'fr' : 'en'
  );
  const count = await animalService.getFilteredAnimalCount(
    request.structureId,
    request.search,
    request.type
  );
  const pagination = animalService.getPaginationInfo(count);
  return { data, pagination };
};

export const getInitialAnimals = async (
  request: AnimalResquest
): Promise<{ data: Animal[]; pagination: PaginationInfo }> => {
  request.page = 1;
  request.sort = 'createdAt';
  request.sortDirection = 'desc';
  request.search = '';
  request.type = undefined;

  return await getAnimals(request);
};
