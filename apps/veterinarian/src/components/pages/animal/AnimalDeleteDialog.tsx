'use client';

import { DialogConfirm } from '@app-test2/shared-components';
import { CanDeleteAnimalReason } from '@elyope/db';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { canDeleteAnimal, deleteAnimal } from './AnimalController';

interface AnimalDeleteDialogProps {
  open: boolean;
  animalId: string | null;
  structureId: string;
  onClose: () => void;
  onDeleted?: () => void;
}

export default function AnimalDeleteDialog({
  open,
  animalId,
  structureId,
  onClose,
  onDeleted,
}: AnimalDeleteDialogProps) {
  const [isChecking, setIsChecking] = useState(false);
  const [canDelete, setCanDelete] = useState(true);
  const [deleteReason, setDeleteReason] =
    useState<CanDeleteAnimalReason | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const tCommon = useTranslations('Data.Common');
  const t = useTranslations('Data.Animal.list');

  // Check if animal can be deleted when dialog opens
  useEffect(() => {
    if (open && animalId) {
      setIsChecking(true);
      setCanDelete(true);
      setDeleteReason(null);

      canDeleteAnimal(structureId, animalId)
        .then((deleteCheck) => {
          setCanDelete(deleteCheck.canDelete);
          setDeleteReason(deleteCheck.reason);
        })
        .catch((error) => {
          console.error('Error checking if animal can be deleted:', error);
          setCanDelete(false);
          setDeleteReason(null);
        })
        .finally(() => {
          setIsChecking(false);
        });
    }
  }, [open, animalId, structureId]);

  const getDeleteMessage = (): string => {
    if (isChecking) {
      return tCommon('messages.loading');
    }

    if (canDelete) {
      return t('dialog.delete_message');
    }

    if (!deleteReason) {
      return t('dialog.cannot_delete_title');
    }

    const hasExams = deleteReason.linkedExams;
    const hasMessages = deleteReason.linkedMessages;

    if (hasExams && hasMessages) {
      return t('dialog.cannot_delete_multiple_reasons');
    } else if (hasExams) {
      return t('dialog.cannot_delete_linked_exams');
    } else if (hasMessages) {
      return t('dialog.cannot_delete_linked_messages');
    }

    return t('dialog.cannot_delete_title');
  };

  const getDeleteTitle = (): string => {
    if (isChecking) {
      return t('dialog.delete_title');
    }
    return canDelete
      ? t('dialog.delete_title')
      : t('dialog.cannot_delete_title');
  };

  const getConfirmLabel = (): string => {
    if (isChecking) {
      return tCommon('messages.loading');
    }
    if (isDeleting) {
      return tCommon('actions.saving');
    }
    return canDelete ? t('actions.delete') : tCommon('actions.close');
  };

  const handleClose = () => {
    if (isChecking || isDeleting) return;
    setIsChecking(false);
    setCanDelete(true);
    setDeleteReason(null);
    setIsDeleting(false);
    onClose();
  };

  const handleConfirm = async () => {
    if (isChecking) return;

    if (canDelete && animalId) {
      setIsDeleting(true);
      try {
        await deleteAnimal(structureId, animalId);
        onDeleted?.();
        handleClose();
      } catch (error) {
        console.error('Error deleting animal:', error);
        setIsDeleting(false);
      }
    } else {
      handleClose();
    }
  };

  return (
    <DialogConfirm
      open={open}
      disableCancel={!canDelete}
      title={getDeleteTitle()}
      message={getDeleteMessage()}
      confirmLabel={getConfirmLabel()}
      cancelLabel={!isChecking && canDelete ? tCommon('actions.cancel') : ''}
      confirmClassName={canDelete ? 'button-destructive' : 'button-primary'}
      isLoading={isChecking || isDeleting}
      onCancel={handleClose}
      onConfirm={handleConfirm}
    />
  );
}
