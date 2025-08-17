'use client';

import React, {
  createContext,
  useContext,
  useState,
  useTransition,
  useCallback,
} from 'react';
import { UserType, UserInvitation, FullUser, Structure } from '@elyope/db';
import {
  updateUserRoles,
  createInvitation,
  getInvitations,
} from './UserDetailController';

type UserDetailContextType = {
  // User state
  currentUser?: FullUser;
  setCurrentUser: (user: FullUser) => void;

  // Invitations state
  invitations: UserInvitation[];
  setInvitations: (invitations: UserInvitation[]) => void;

  // Structures state
  allStructures: Structure[];
  userStructures: Structure[];

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
  _currentUser: FullUser | null;
  _invitations: UserInvitation[];
  _userStructures?: Structure[];
  _allStructures?: Structure[];
};

export function UserDetailProvider({
  children,
  _currentUser,
  _invitations,
  _userStructures = [],
  _allStructures = [],
}: UserDetailProviderProps) {
  const [currentUser, setCurrentUser] = useState<FullUser | null>(_currentUser);
  const [invitations, setInvitations] =
    useState<UserInvitation[]>(_invitations);
  const [isRolesSaving, setIsRolesSaving] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Role management handler
  const handleRolesSave = useCallback(
    async (roles: UserType[]) => {
      if (!_currentUser || !currentUser) return;

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // Load invitations for the current user
  const loadInvitations = useCallback(async () => {
    if (!_currentUser || !currentUser) return;
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Create new invitation
  const handleCreateInvitation = useCallback(async () => {
    if (!_currentUser || !currentUser) return;
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
    currentUser: currentUser || undefined,
    setCurrentUser,

    // Invitations state
    invitations,
    setInvitations,

    // Structures state
    allStructures: _allStructures,
    userStructures: _userStructures,

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
