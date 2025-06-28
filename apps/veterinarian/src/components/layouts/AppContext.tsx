'use client';

import { type AppUser } from '@app-test2/shared-components';
import { createContext, ReactNode, useContext } from 'react';

type AppContextProps = {
  children: ReactNode;
  user?: AppUser;
};

type AppContextValues = {
  connected?: AppUser;
};

export const AppContext = createContext<AppContextValues | undefined>(
  undefined
);

export const AppProvider = ({ children, user }: AppContextProps) => {
  const contextValue: AppContextValues = {
    connected: user,
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
