import {
  getInvitations,
  getUserByExternalId,
  getUserStructures,
  listAllStructures,
} from '@/components/pages/user/UserDetailController';
import UserDetailContent from '@/components/pages/user/UserDetailContent';
import { UserDetailProvider } from '@/components/pages/user/UserDetailContext';
import { notFound } from 'next/navigation';
import { UserInvitation } from '@elyope/db';

type UserDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function UserDetailPage({ params }: UserDetailPageProps) {
  const { id } = await params;
  console.log('UserDetailPage', id);
  const user = await getUserByExternalId(id);

  if (!user) {
    return notFound();
  }

  const [invitations, userStructures, allStructures] = await Promise.all([
    getInvitations({ userId: user.id }) as unknown as Promise<UserInvitation[]>,
    getUserStructures({ userId: user.id }),
    listAllStructures(),
  ]);

  console.log('UserDetailPage', userStructures, allStructures);
  return (
    <UserDetailProvider
      _currentUser={user}
      _invitations={invitations}
      _userStructures={userStructures || []}
      _allStructures={allStructures?.data || []}
    >
      <UserDetailContent />
    </UserDetailProvider>
  );
}
