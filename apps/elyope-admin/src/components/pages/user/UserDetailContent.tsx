'use client';

import { UserType, Structure } from '@elyope/db';
import {
  Button,
  PageHeader,
  PageMain,
  PanelTitle,
  UserIcon,
  DataGrid,
  TrashIcon,
  FormSeparator,
  DialogConfirm,
} from '@app-test2/shared-components';
import { UserRoleManagement } from './UserRoleManagement';
import { UserInvitationComponent } from './UserInvitation';
import { UserStructureManagement } from './UserStructureManagement';
import { useUserDetail } from './UserDetailContext';
import { removeFromAStructure } from './UserDetailController';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useState } from 'react';

export default function UserDetailContent() {
  const router = useRouter();
  const [confirmRemove, setConfirmRemove] = useState<{
    show: boolean;
    structure: Structure | null;
  }>({ show: false, structure: null });
  const { currentUser, handleRolesSave, userStructures } = useUserDetail();

  if (!currentUser) {
    return <div>User not found</div>;
  }

  const handleRolesSaveWrapper = async (roles: UserType[]) => {
    await handleRolesSave(roles);
    // Refresh the page to ensure data consistency
    router.refresh();
  };

  const handleRemoveStructure = (structureId: string) => {
    const structure = userStructures.find((s) => s.id === structureId);
    if (structure) {
      setConfirmRemove({ show: true, structure });
    }
  };

  const handleConfirmRemove = async () => {
    if (!confirmRemove.structure) return;

    try {
      await removeFromAStructure({
        userId: currentUser.id,
        structureId: confirmRemove.structure.id,
      });
      setConfirmRemove({ show: false, structure: null });
      router.refresh();
    } catch (error) {
      console.error('Error removing user from structure:', error);
      setConfirmRemove({ show: false, structure: null });
    }
  };

  const handleCancelRemove = () => {
    setConfirmRemove({ show: false, structure: null });
  };

  // Define columns for the DataGrid
  const structureColumns = [
    {
      header: 'Structure Name',
      field: 'name' as keyof Structure,
      className: 'font-medium',
      isSortable: false,
    },
  ];

  return (
    <>
      <PageHeader
        title={`User Details: ${currentUser.first_name} ${currentUser.last_name}`}
        action={
          <Button
            className="button-primary-inverse"
            onClick={() => router.push('/user')}
          >
            ← Back to Users
          </Button>
        }
      />

      <PageMain className="p-0">
        {/* Two-column grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
          {/* Left Column: User Information & Roles */}
          <div className="flex flex-col gap-4 h-full">
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

          {/* Right Column: Structure Management & User Invitations */}
          <div className="flex flex-col gap-4">
            {/* Structure Management Section */}
            <div className="bg-white rounded p-6">
              <UserStructureManagement />
              <FormSeparator className="my-4 bg-el-grey-300" />
              {/* User Structures DataGrid */}
              <DataGrid
                blueMode={true}
                columns={structureColumns}
                data={userStructures}
                loadingRows={2}
                noDataMessage="No structures assigned to this user"
                rowActions={[
                  {
                    name: 'Remove from structure',
                    icon: <TrashIcon className="w-6 h-6" />,
                    propertyKey: 'id',
                    onClick: (structureId) =>
                      handleRemoveStructure(structureId as string),
                    className: 'hover:text-el-red-500 ',
                  },
                ]}
                className=" "
              />
            </div>

            {/* User Invitations Section */}
            <div className="bg-white rounded p-6 h-full">
              <UserInvitationComponent />
            </div>
          </div>
        </div>
      </PageMain>

      {/* Confirmation Dialog */}
      <DialogConfirm
        open={confirmRemove.show}
        title="Remove User from Structure"
        message={
          confirmRemove.structure
            ? `Are you sure you want to remove this user from "${confirmRemove.structure.name}"? This action cannot be undone.`
            : ''
        }
        confirmLabel="Remove"
        cancelLabel="Cancel"
        onConfirm={handleConfirmRemove}
        onCancel={handleCancelRemove}
        confirmClassName="button-destructive text-el-grey-800"
      />
    </>
  );
}
