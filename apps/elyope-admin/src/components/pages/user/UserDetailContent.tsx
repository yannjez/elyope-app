'use client';

import { UserType } from '@elyope/db';
import {
  Button,
  PageHeader,
  PageMain,
  PanelTitle,
  UserIcon,
} from '@app-test2/shared-components';
import { UserRoleManagement } from './UserRoleManagement';
import { UserInvitationComponent } from './UserInvitation';
import { useUserDetail } from './UserDetailContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function UserDetailContent() {
  const router = useRouter();
  const { currentUser, handleRolesSave } = useUserDetail();

  const handleRolesSaveWrapper = async (roles: UserType[]) => {
    await handleRolesSave(roles);
    // Refresh the page to ensure data consistency
    router.refresh();
  };

  return (
    <>
      <PageHeader
        title={`User Details: ${currentUser.first_name} ${currentUser.last_name}`}
        action={
          <Button onClick={() => router.push('/user')}>Back to Users</Button>
        }
      />

      <PageMain className="p-0">
        {/* Two-column grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
          {/* Left Column: User Information & Roles */}
          <div className="flex flex-col gap-4">
            {/* User Information Section */}
            <div className="bg-white rounded border border-gray-200 p-6">
              <h2 className="">
                <PanelTitle title="User Informations" />
              </h2>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                    {currentUser.image_url ? (
                      <Image
                        width={64}
                        height={64}
                        src={currentUser.image_url}
                        alt={`${currentUser.first_name} ${currentUser.last_name}`}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <UserIcon className="w-8 h-8 text-gray-500" />
                    )}
                  </div>
                </div>

                <div className="flex-1 grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      Full Name
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {currentUser.first_name} {currentUser.last_name}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      Email
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {currentUser.email_addresses?.[0]?.email_address ||
                        'No email provided'}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      User ID
                    </label>
                    <p className="mt-1 text-sm text-gray-900 font-mono">
                      {currentUser.externalId || currentUser.id}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      Account Status
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Role Management Section */}
            <div className="bg-white rounded  p-6 flex-1">
              <UserRoleManagement
                currentRoles={currentUser.roles as UserType[]}
                onSave={handleRolesSaveWrapper}
              />
            </div>
          </div>

          {/* Right Column: User Invitations */}
          <div className="bg-el-grey-100 rounded  p-6">
            <UserInvitationComponent />
          </div>
        </div>
      </PageMain>
    </>
  );
}
