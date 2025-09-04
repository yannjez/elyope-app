import { AnimalSpecies, ListRequestType } from '@elyope/db';

export type AnimalResquest = ListRequestType & {
  type?: AnimalSpecies;
};
