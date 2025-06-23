'use client';

import { ExamenFilter, type ExamenStatus } from '@app-test2/shared-components';
import { createContext, ReactNode, useContext, useState } from 'react';

export type ExamenFilterKeys = 'status' | 'keyword';

type ExamenControllerContextProps = {
  children: ReactNode;
};

type ExamenControllerContextValues = {
  filters: ExamenFilter;
  updateFilters: (key: ExamenFilterKeys, value: string | ExamenStatus) => void;
};

export const ExamenControllerContext = createContext<
  ExamenControllerContextValues | undefined
>(undefined);

export const ExamenControllerProvider = ({
  children,
}: ExamenControllerContextProps) => {
  const [filters, setFilters] = useState<ExamenFilter>({
    status: undefined,
    keyword: '',
  });

  const updateFilters = (key: ExamenFilterKeys, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const contextValue: ExamenControllerContextValues = {
    filters,
    updateFilters,
  };

  return (
    <ExamenControllerContext.Provider value={contextValue}>
      {children}
    </ExamenControllerContext.Provider>
  );
};

export const useExamenControllerContext = () => {
  const context = useContext(ExamenControllerContext);
  if (!context) {
    throw new Error(
      'useExamenControllerContext must be used within a ExamenControllerProvider'
    );
  }
  return context;
};
