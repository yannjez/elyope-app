import { getUserByExternalId } from '@/components/pages/user/UserDetailController';
import UserDetailContent from '@/components/pages/user/UserDetailContent';
import { notFound } from 'next/navigation';
type UserDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function UserDetailPage({ params }: UserDetailPageProps) {
  const { id } = await params;
  console.log('params', params);
  const user = await getUserByExternalId(id);
  console.log('user', user);

  if (!user) {
    notFound();
  }

  return <UserDetailContent user={user} />;
}
