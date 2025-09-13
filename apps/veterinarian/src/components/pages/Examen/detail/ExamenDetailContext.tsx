'use client';

import { ExamWithRelations } from '@elyope/db';
import { createContext, useContext } from 'react';

type ExamenDetailContextType = {
  examen?: ExamWithRelations;
};

const ExamenDetailContext = createContext<ExamenDetailContextType | undefined>(
  undefined
);

type ExamenDetailProviderProps = {
  children: React.ReactNode;
  _examen?: ExamWithRelations;
};

export const ExamenDetailProvider = ({
  children,
  _examen,
}: ExamenDetailProviderProps) => {
  return (
    <ExamenDetailContext.Provider value={{ examen: _examen }}>
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
