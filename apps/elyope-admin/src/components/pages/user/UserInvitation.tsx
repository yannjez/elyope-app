'use client';

import { useState } from 'react';
import {
  Button,
  PanelTitle,
  DialogModal,
  DataGrid,
  DataGridColumn,
} from '@app-test2/shared-components';
import { UserInvitation } from '@elyope/db';
import { useUserDetail } from './UserDetailContext';

// Types for invitations

// No form schema needed anymore

export function UserInvitationComponent() {
  const { invitations, isPending, currentUser, handleCreateInvitation } =
    useUserDetail();

  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Handle invitation creation with modal
  const handleConfirmInvitation = async () => {
    try {
      await handleCreateInvitation();
    } catch (error) {
      console.error('Failed to create invitation:', error);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // DataGrid columns configuration
  const invitationColumns: DataGridColumn<UserInvitation>[] = [
    {
      header: 'Email',
      field: 'email',
      isSortable: true,
    },
    {
      header: 'Created At',
      field: 'createdAt',
      isSortable: true,
      displayCell: (invitation: UserInvitation) =>
        formatDate(invitation.createdAt),
    },
  ];

  const handleOpenInviteModal = () => {
    setShowConfirmModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PanelTitle title="User Invitations">User Invitations</PanelTitle>
        <Button
          onClick={handleOpenInviteModal}
          className="button button-primary"
          disabled={!currentUser?.email}
        >
          + Send Invitation
        </Button>
      </div>

      {!currentUser?.email && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            User email is required to manage invitations.
          </p>
        </div>
      )}

      {/* Confirmation Modal */}
      <DialogModal
        open={showConfirmModal}
        onCancel={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmInvitation}
        title="Send Invitation"
        confirmLabel={isPending ? 'Sending...' : 'Send Invitation'}
        cancelLabel="Cancel"
        isLoading={isPending}
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Send an invitation to{' '}
            <strong>{currentUser?.fullName || currentUser?.email}</strong>?
          </p>

          <div className="text-xs text-gray-500">
            The user will receive an email with invitation links based on the
            selected roles.
          </div>
        </div>
      </DialogModal>

      {/* Invitations DataGrid */}
      <DataGrid
        columns={invitationColumns}
        data={invitations}
        isLoading={isPending && invitations.length === 0}
        loadingRows={3}
        noDataMessage="No invitations found for this user."
      />
    </div>
  );
}
