'use client';

import { AnimalFull, ExamWithRelations } from '@elyope/db';
import { createContext, useContext } from 'react';

type ExamenDetailContextType = {
  examen?: ExamWithRelations;
  animal?: AnimalFull;
  animals?: AnimalFull[];
};

const ExamenDetailContext = createContext<ExamenDetailContextType | undefined>(
  undefined
);

type ExamenDetailProviderProps = {
  children: React.ReactNode;
  _examen?: ExamWithRelations;
  _animal?: AnimalFull;
  _animals?: AnimalFull[];
};

export const ExamenDetailProvider = ({
  children,
  _examen,
  _animal,
  _animals,
}: ExamenDetailProviderProps) => {
  const value = {
    examen: _examen,
    animal: _animal,
    animals: _animals,
  };

  return (
    <ExamenDetailContext.Provider value={value}>
      {children}
    </ExamenDetailContext.Provider>
  );
};

export const useExamenDetailContext = () => {
  const context = useContext(ExamenDetailContext);
  if (!context) {
    throw new Error(
      'useExamenDetailContext must be used within a ExamenDetailProvider'
    );
  }
  return context;
};
