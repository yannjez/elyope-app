'use client';

import { type AppUser } from '@app-test2/shared-components';
import { Structure } from '@elyope/db';
import { useRouter } from 'next/navigation';
import { createContext, ReactNode, useContext } from 'react';

type AppContextProps = {
  children: ReactNode;
  user?: AppUser;
  locale: 'fr' | 'en';
  _structures: Structure[];
  _currentStructure: Structure;
};

type AppContextValues = {
  connected?: AppUser;
  locale: 'fr' | 'en';
  currentStructure: Structure | undefined;
  structures: Structure[];
  handleStructureChange: (structureId: string) => void;
};

export const AppContext = createContext<AppContextValues | undefined>(
  undefined
);

export const AppProvider = ({
  children,
  user,
  locale,
  _structures,
  _currentStructure,
}: AppContextProps) => {
  const router = useRouter();

  const handleStructureChange = (structureId: string) => {
    if (_structures.some((s) => s.id === structureId)) {
      router.push(`/${structureId}`);
    }
  };

  const contextValue: AppContextValues = {
    connected: user,
    locale,
    currentStructure: _currentStructure,
    structures: _structures,
    handleStructureChange,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within a AppProvider');
  }
  return context;
};
