import { auth, currentUser } from '@clerk/nextjs/server';
import { notFound, redirect } from 'next/navigation';
import { AppProvider } from './AppContext';
import { SidemenuWrapper } from '../commons/SidemenuWrapper';
import { StructureService } from '@elyope/db';
import { prisma } from '@/db';

type ProtectedLayoutProps = {
  children: React.ReactNode;
  locale: 'fr' | 'en';
  structureIdParams: string;
};

export default async function ProtectedLayout({
  children,
  locale,
  structureIdParams,
}: ProtectedLayoutProps) {
  const { userId } = await auth();
  if (!userId) {
    return notFound();
  }

  const structureService = new StructureService(prisma);
  const structures = (
    await structureService.getStrucuturesByExternalId(userId)
  ).filter((structure) => structure.is_structure_active);

  const currentStructure = structures.find(
    (structure) => structure.id === structureIdParams
  );

  if (!currentStructure) {
    const otherStructure = structures.find(
      (structure) => structure.id !== structureIdParams
    );
    if (otherStructure) {
      return redirect(`/${otherStructure.id}`);
    }
  }

  if (!currentStructure) {
    return redirect('/notAllowed');
  }

  const user = await currentUser();

  return (
    <AppProvider
      _structures={structures}
      _currentStructure={currentStructure}
      locale={locale}
      user={{
        id: user?.id || '',
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        emailAddress: user?.emailAddresses?.at(0)?.emailAddress || '',
      }}
    >
      <div className="flex gap-1">
        <SidemenuWrapper />
        <main className="w-full p-3 md:p-3 pt-16 md:pt-3">{children}</main>
      </div>
    </AppProvider>
  );
}
