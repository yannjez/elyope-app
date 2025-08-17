'use server';

import { prisma, PrismaClient } from '@/db';
import { FullUser, UserType, UserService, StructureService } from '@elyope/db';

const userService = new UserService(prisma as PrismaClient);
const structureService = new StructureService(prisma as PrismaClient);

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

export async function addToAStructure(data: {
  userId: string;
  structureId: string;
}) {
  console.log('addToAStructure', data);
  try {
    return await structureService.addUserToStructure(
      data.structureId,
      data.userId
    );
  } catch (error) {
    console.error('Error adding to a structure:', error);
    throw error;
  }
}

export async function removeFromAStructure(data: {
  userId: string;
  structureId: string;
}) {
  try {
    return await structureService.removeUserFromStructure(
      data.structureId,
      data.userId
    );
  } catch (error) {
    console.error('Error removing from a structure:', error);
    throw error;
  }
}

export async function getUserStructures(data: { userId: string }) {
  try {
    return await structureService.getStructuresByUserId(data.userId);
  } catch (error) {
    console.error('Error getting user structures:', error);
    throw error;
  }
}

export async function listAllStructures() {
  try {
    return await structureService.getStructures(1, 100);
  } catch (error) {
    console.error('Error getting user structures:', error);
    throw error;
  }
}
