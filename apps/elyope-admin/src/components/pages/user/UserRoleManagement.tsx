'use client';

import React, { useMemo, useState } from 'react';
import { UserType } from '@elyope/db';
import {
  SelectMultiButtons,
  type Option,
  Button,
  PanelTitle,
} from '@app-test2/shared-components';
import { useTranslations } from 'next-intl';

// Moved rolesOptions inside component to access translations

type UserRoleManagementProps = {
  currentRoles: UserType[];
  onSave: (roles: UserType[]) => Promise<void>;
  isLoading?: boolean;
};

export function UserRoleManagement({
  currentRoles,
  onSave,
  isLoading = false,
}: UserRoleManagementProps) {
  const t = useTranslations('Data.User.role_management');
  const tRoles = useTranslations('Data.User.roles');
  const tCommon = useTranslations('Data.Common');

  const rolesOptions: Array<Option & { color: string }> = useMemo(
    () => [
      {
        label: tRoles('veterinarian'),
        value: 'VETERINARIAN',
        color: 'bg-el-blue-400',
      },
      {
        label: tRoles('interpreter'),
        value: 'INTERPRETER',
        color: 'bg-el-green-300',
      },
      {
        label: tRoles('admin'),
        value: 'ADMIN',
        color: 'bg-el-yellow-300',
      },
    ],
    [tRoles]
  );

  const safeCurrentRoles = useMemo(() => currentRoles || [], [currentRoles]);
  const [rolesDraft, setRolesDraft] = useState<UserType[]>([
    ...safeCurrentRoles,
  ]);
  const [isSaving, setIsSaving] = useState(false);

  // Update draft when currentRoles changes
  React.useEffect(() => {
    setRolesDraft([...safeCurrentRoles]);
  }, [safeCurrentRoles]);

  // Improved change detection - sort arrays for comparison
  const hasChanges = React.useMemo(() => {
    const currentSorted = [...safeCurrentRoles].sort();
    const draftSorted = [...rolesDraft].sort();

    if (currentSorted.length !== draftSorted.length) return true;

    return !currentSorted.every((role, index) => role === draftSorted[index]);
  }, [safeCurrentRoles, rolesDraft]);

  const handleSave = async () => {
    if (!hasChanges) return;

    setIsSaving(true);
    try {
      await onSave(rolesDraft);
    } catch (error) {
      console.error('Error saving roles:', error);
      // Reset to current roles on error
      setRolesDraft([...safeCurrentRoles]);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setRolesDraft([...safeCurrentRoles]);
  };

  return (
    <div className="space-y-4">
      <div>
        <PanelTitle title={t('title')} />
        <SelectMultiButtons
          options={rolesOptions}
          value={rolesDraft}
          onValuesChange={(vals) => setRolesDraft(vals as UserType[])}
          minSelections={1}
          maxSelections={3}
          name="user-roles"
          t={(key, options) => {
            if (key === 'Validation.SelectMultiButtons.min_selections') {
              return t('validation.min_selections', options);
            }
            if (key === 'Validation.SelectMultiButtons.max_selections') {
              return t('validation.max_selections', options);
            }
            return key;
          }}
        />
      </div>

      {/* Always show buttons for now - remove hasChanges condition for debugging */}
      <div className="flex gap-2 pt-4 border-t border-gray-200">
        <Button
          onClick={handleSave}
          disabled={!hasChanges || isSaving || isLoading}
          className="button-primary"
        >
          {isSaving ? tCommon('actions.saving') : tCommon('actions.save')}
        </Button>
        <Button
          onClick={handleReset}
          disabled={isSaving || isLoading}
          className="button-neutral"
        >
          {tCommon('actions.reset')}
        </Button>
        {!hasChanges && (
          <span className="text-sm text-gray-500 self-center">
            {tCommon('messages.no_changes')}
          </span>
        )}
      </div>
    </div>
  );
}
