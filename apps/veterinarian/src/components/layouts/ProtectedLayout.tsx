import { auth, clerkClient, currentUser } from '@clerk/nextjs/server';
import { notFound } from 'next/navigation';
import { AppProvider } from './AppContext';
import { SidemenuWrapper } from '../commons/SidemenuWrapper';
// Removed invalid import of UserService from @elyope/db


export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  if (!userId) {
    return notFound();
  }

  // const clerkUser = await currentUser();

  // const userService = new UserService(prisma);
  // const appUser = await userService.createUpdateUser(
  //   {
  //     id: userId,
  //     email: clerkUser?.emailAddresses?.[0]?.emailAddress || '',
  //     name: clerkUser?.fullName || '',
  //   },
  //   'VETERINARIAN'
  // );
  // console.log(appUser);

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
        <SidemenuWrapper />
        <main className="w-full">{children}</main>
      </div>
    </AppProvider>
  );
}
