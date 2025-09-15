'use server';

import { prisma } from '@/db';
import { AnimalResquest } from '@/types/animals';
import {
  Animal,
  AnimalBreedFull,
  AnimalService,
  PaginationInfo,
  CanDeleteAnimalReason,
  AnimalSpecies,
  AnimalSortField,
} from '@elyope/db';
import { getLocale } from 'next-intl/server';

export const getAnimalBreeds = async (): Promise<AnimalBreedFull[]> => {
  const locale = await getLocale();
  const animalService = new AnimalService(prisma);
  return await animalService.getAnimalBreedList(
    undefined,
    false,
    locale?.includes('fr') ? 'fr' : 'en'
  );
};

export const canDeleteAnimal = async (
  structureId: string,
  id: string
): Promise<{ canDelete: boolean; reason: CanDeleteAnimalReason }> => {
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
    request.sort as AnimalSortField | undefined,
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

export type CreateAnimalInput = {
  name: string;
  species: AnimalSpecies;
  breedId: string;
  structureId: string;
  externalRef?: string | null;
  birthDate?: Date | null;
  comment?: string | null;
};

export const createAnimal = async (input: CreateAnimalInput) => {
  const animalService = new AnimalService(prisma);
  return await animalService.createAnimal(input);
};

export const updateAnimal = async (
  id: string,
  input: Partial<Omit<CreateAnimalInput, 'structureId'>>
) => {
  const animalService = new AnimalService(prisma);
  return await animalService.updateAnimal(id, input);
};

export const getAnimalById = async (id: string, structureId: string) => {
  const locale = await getLocale();
  const animalService = new AnimalService(prisma);
  return await animalService.getAnimalById(
    id,
    structureId,
    locale?.includes('fr') ? 'fr' : 'en'
  );
};
