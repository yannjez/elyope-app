import UserCreateContent from '@/components/pages/user/USerCreateContent';
import { UserDetailProvider } from '@/components/pages/user/UserDetailContext';
import { Button } from '@app-test2/shared-components';
import { FullUser } from '@elyope/db';

export default async function NewUserPage() {
  return (
    <UserDetailProvider
      _currentUser={null as unknown as FullUser}
      _invitations={[]}
      _userStructures={[]}
      _allStructures={[]}
    >
      <UserCreateContent />
    </UserDetailProvider>
  );
}
