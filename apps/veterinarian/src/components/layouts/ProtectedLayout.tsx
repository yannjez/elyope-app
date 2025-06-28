import { auth, clerkClient, currentUser } from '@clerk/nextjs/server';
import { Sidemenu } from '@/components/shared';
import { notFound } from 'next/navigation';
import { AppProvider } from './AppContext';

import ProfilButton from '../clerk/ProfilButton';

const menuItems = [
  { href: '/', label: 'Accueil' },
  { href: '/examens', label: 'Examens' },
  { href: '#', label: 'Animaux' },
  { href: '#', label: 'Messagerie', badge: 1 },
  { href: '/design', label: 'Design' },
];

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  // const user = (await clerkClient()).users.getUser(userId)

  if (!userId) {
    return notFound();
  }
  const memberships = await (
    await clerkClient()
  ).users.getOrganizationMembershipList({
    userId,
  });

  const orgId = memberships?.data?.[0]?.organization?.id;

  if (!orgId) {
    return notFound();
  }

  const user = await currentUser();

  return (
    <AppProvider
      user={{
        id: user?.id || '',
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        emailAddress: user?.emailAddresses?.at(0)?.emailAddress || '',
        organizationId: orgId,
      }}
    >
      <div className="flex gap-1">
        <Sidemenu
          menuItems={menuItems}
          profileButton={<ProfilButton label="Mon profil" />}
        />
        <main className="w-full">{children}</main>
      </div>
    </AppProvider>
  );
}
