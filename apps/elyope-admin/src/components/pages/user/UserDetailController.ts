'use server';

import { prisma, PrismaClient } from '@/db';
import { FullUser, UserType, UserService, UserInvitation } from '@elyope/db';

const userService = new UserService(prisma as PrismaClient);

export async function getUserByExternalId(
  externalId: string
): Promise<FullUser | null> {
  try {
    return await userService.getUserByExternalId(externalId);
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}

export async function updateUserRoles(
  externalId: string,
  roles: UserType[]
): Promise<void> {
  try {
    await userService.updateUserRoles(externalId, roles);
  } catch (error) {
    console.error('Error updating user roles:', error);
    throw error;
  }
}

// ============ INVITATION CONTROLLERS ============

export async function createInvitation(data: {
  email: string;

  userId?: string;
}) {
  try {
    return await userService.createInvitation(data);
  } catch (error) {
    console.error('Error creating invitation:', error);
    throw error;
  }
}

export async function getInvitations(data: { userId: string }) {
  try {
    return await userService.getInvitations(data);
  } catch (error) {
    console.error('Error getting invitations:', error);
    throw error;
  }
}
