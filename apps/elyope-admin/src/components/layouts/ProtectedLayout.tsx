import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
// import { AppProvider } from './AppContext';

// Removed invalid import of UserService from @elyope/db
import { prisma } from '@/db';
import { UserService } from '@elyope/db';

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  if (!userId) {
    return redirect('/login');
  }

  const userService = new UserService(prisma);
  const adminUser = await userService.getUserByExternalId(userId);

  if (!adminUser || !adminUser.roles?.includes('  ADMIN')) {
    return redirect('/notAllowed');
  }

  return (
    // <AppProvider
    //   user={{
    //     id: "user?.id || ''",
    //     firstName: " user?.firstName || ''",
    //     lastName: "user?.lastName || ''",
    //     emailAddress: "user?.emailAddresses?.at(0)?.emailAddress || ''",
    //     organizationId: 'orgId',
    //   }}
    // >
    <div className="flex gap-1">
      {/* <SidemenuWrapper /> */}
      <main className="w-full">{children}</main>
    </div>
    // </AppProvider>
  );
}
