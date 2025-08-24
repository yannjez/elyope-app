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
import { useTranslations } from 'next-intl';

// Types for invitations

// No form schema needed anymore

export function UserInvitationComponent() {
  const t = useTranslations('Data.User.invitations');
  const tCommon = useTranslations('Data.Common');
  const { invitations, isPending, currentUser, handleCreateInvitation } =
    useUserDetail();

  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Handle invitation creation with modal
  const handleConfirmInvitation = async () => {
    try {
      await handleCreateInvitation();
      setShowConfirmModal(false);
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
      header: tCommon('fields.email'),
      field: 'email',
      isSortable: false,
    },
    {
      header: tCommon('fields.created_at'),
      field: 'createdAt',
      isSortable: false,
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
        <PanelTitle title={t('title')}>{t('title')}</PanelTitle>
        <Button
          onClick={handleOpenInviteModal}
          className="button button-primary"
          disabled={!currentUser?.email}
        >
          {t('send_button')}
        </Button>
      </div>

      {!currentUser?.email && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">{t('email_required')}</p>
        </div>
      )}

      {/* Confirmation Modal */}
      <DialogModal
        open={showConfirmModal}
        onCancel={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmInvitation}
        title={t('modal.title')}
        confirmLabel={
          isPending ? t('modal.confirm_sending') : t('modal.confirm')
        }
        cancelLabel={tCommon('actions.cancel')}
        isLoading={isPending}
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            {t('modal.message', {
              name:
                currentUser?.fullName || currentUser?.email || 'Unknown User',
            })}
          </p>

          <div className="text-xs text-gray-500">{t('modal.description')}</div>
        </div>
      </DialogModal>

      {/* Invitations DataGrid */}
      <DataGrid
        blueMode={true}
        columns={invitationColumns}
        data={invitations}
        isLoading={isPending && invitations.length === 0}
        loadingRows={3}
        noDataMessage={t('no_data')}
      />
    </div>
  );
}
