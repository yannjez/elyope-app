import UserListContent from '@/components/pages/user/UserListContent';
import { UserListProvider } from '@/components/pages/user/UserListContext';
import { getUserList } from '@/components/pages/user/UserListController';

export default async function UserPage() {
  const { data, pagination } = await getUserList();

  return (
    <UserListProvider _data={data} _pagination={pagination}>
      <UserListContent />
    </UserListProvider>
  );
}
