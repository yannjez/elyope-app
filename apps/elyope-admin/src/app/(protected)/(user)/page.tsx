import UserListContent from '@/components/pages/user/UserListContent';
import { getUserList } from '@/components/pages/user/UserListController';

export default async function UserPage() {
  const { data, pagination } = await getUserList();

  return <UserListContent _data={data} _pagination={pagination} />;
}
