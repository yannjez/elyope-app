'use client';

import { AnimalBreedFull, AnimalFull } from '@elyope/db';
import { createContext, useContext } from 'react';

type AnimalDetailContextType = {
  animal?: AnimalFull;
  breeds: AnimalBreedFull[];
};

const AnimalDetailContext = createContext<AnimalDetailContextType | undefined>(
  undefined
);

type AnimalDetailProviderProps = {
  children: React.ReactNode;
  _animal?: AnimalFull;
  _breeds: AnimalBreedFull[];
};

export const AnimalDetailProvider = ({
  children,
  _animal,
  _breeds,
}: AnimalDetailProviderProps) => {
  return (
    <AnimalDetailContext.Provider value={{ animal: _animal, breeds: _breeds }}>
      {children}
    </AnimalDetailContext.Provider>
  );
};

export const useAnimalDetailContext = () => {
  const context = useContext(AnimalDetailContext);
  if (!context) {
    throw new Error(
      'useAnimalDetail must be used within a AnimalDetailProvider'
    );
  }
  return context;
};
