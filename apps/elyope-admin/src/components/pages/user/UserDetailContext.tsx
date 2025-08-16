'use client';

import React, {
  createContext,
  useContext,
  useState,
  useTransition,
  useCallback,
} from 'react';
import { UserType, UserInvitation, FullUser } from '@elyope/db';
import {
  updateUserRoles,
  createInvitation,
  getInvitations,
} from './UserDetailController';

type UserDetailContextType = {
  // User state
  currentUser: FullUser;
  setCurrentUser: (user: FullUser) => void;

  // Invitations state
  invitations: UserInvitation[];
  setInvitations: (invitations: UserInvitation[]) => void;

  // Loading states
  isPending: boolean;
  isRolesSaving: boolean;

  // Role management handlers
  handleRolesSave: (roles: UserType[]) => Promise<void>;

  // Invitation handlers
  loadInvitations: () => Promise<void>;
  handleCreateInvitation: () => Promise<void>;
};

const UserDetailContext = createContext<UserDetailContextType | undefined>(
  undefined
);

type UserDetailProviderProps = {
  children: React.ReactNode;
  _currentUser: FullUser;
  _invitations: UserInvitation[];
};

export function UserDetailProvider({
  children,
  _currentUser,
  _invitations,
}: UserDetailProviderProps) {
  const [currentUser, setCurrentUser] = useState<FullUser>(_currentUser);
  const [invitations, setInvitations] =
    useState<UserInvitation[]>(_invitations);
  const [isRolesSaving, setIsRolesSaving] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Role management handler
  const handleRolesSave = useCallback(
    async (roles: UserType[]) => {
      setIsRolesSaving(true);
      try {
        await updateUserRoles(currentUser.externalId, roles);
        setCurrentUser({
          ...currentUser,
          roles,
        });
      } catch (error) {
        console.error('Error saving roles:', error);
        throw error;
      } finally {
        setIsRolesSaving(false);
      }
    },
    [currentUser]
  );

  // Load invitations for the current user
  const loadInvitations = useCallback(async () => {
    const userEmail =
      currentUser.email_addresses?.[0]?.email_address || currentUser.email;
    if (!userEmail) return;

    startTransition(async () => {
      try {
        const data = await getInvitations({ userId: currentUser.id });
        setInvitations(data as unknown as UserInvitation[]);
      } catch (error) {
        console.error('Failed to load invitations:', error);
      }
    });
  }, [currentUser]);

  // Create new invitation
  const handleCreateInvitation = useCallback(async () => {
    const userEmail =
      currentUser.email_addresses?.[0]?.email_address || currentUser.email;
    if (!userEmail || currentUser.roles.length === 0) {
      console.log('Cannot create invitation: missing email or roles');
      return;
    }
    console.log('Creating invitation', {
      currentUser,
    });
    startTransition(async () => {
      try {
        console.log('Creating invitation', {
          userEmail,
          roles: currentUser.roles,
          userId: currentUser.id,
        });
        const result = await createInvitation({
          userId: currentUser.id,
          email: userEmail,
        });
        console.log('Invitation created successfully:', result);
        await loadInvitations();
      } catch (error) {
        console.error('Failed to create invitation:', error);
        throw error;
      }
    });
  }, [currentUser, loadInvitations]);

  const contextValue: UserDetailContextType = {
    // User state
    currentUser,
    setCurrentUser,

    // Invitations state
    invitations,
    setInvitations,

    // Loading states
    isPending,
    isRolesSaving,

    // Role management handlers
    handleRolesSave,

    // Invitation handlers
    loadInvitations,
    handleCreateInvitation,
  };

  return (
    <UserDetailContext.Provider value={contextValue}>
      {children}
    </UserDetailContext.Provider>
  );
}

export function useUserDetail() {
  const context = useContext(UserDetailContext);
  if (context === undefined) {
    throw new Error('useUserDetail must be used within a UserDetailProvider');
  }
  return context;
}
