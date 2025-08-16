import {
  getInvitations,
  getUserByExternalId,
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
  const user = await getUserByExternalId(id);

  if (!user) {
    return notFound();
  }
  const invitations = (await getInvitations({
    userId: user.id,
  })) as unknown as UserInvitation[];

  return (
    <UserDetailProvider _currentUser={user} _invitations={invitations}>
      <UserDetailContent />
    </UserDetailProvider>
  );
}
