import { StructureService } from '@elyope/db';
import { prisma } from '@/db';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function Home() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/login');
  }

  // Get user's structures to redirect to first available structure
  const structureService = new StructureService(prisma);
  const structures = (
    await structureService.getStrucuturesByExternalId(userId)
  ).filter((structure) => structure.is_structure_active);

  if (structures.length === 0) {
    redirect('/notAllowed');
  }

  // Redirect to first structure if no structure is selected
  redirect(`/${structures[0].id}`);
}
