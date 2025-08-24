'use client';

import React, { useMemo, useState } from 'react';
import { UserType } from '@elyope/db';
import {
  SelectMultiButtons,
  type Option,
  Button,
  PanelTitle,
} from '@app-test2/shared-components';

const rolesOptions: Array<Option & { color: string }> = [
  {
    label: 'Veterinarian',
    value: 'VETERINARIAN',
    color: 'bg-el-blue-400',
  },
  {
    label: 'Interpreter',
    value: 'INTERPRETER',
    color: 'bg-el-green-300',
  },
  {
    label: 'Admin',
    value: 'ADMIN',
    color: 'bg-el-yellow-300',
  },
];

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
        <PanelTitle title="User Roles" />
        <SelectMultiButtons
          options={rolesOptions}
          value={rolesDraft}
          onValuesChange={(vals) => setRolesDraft(vals as UserType[])}
          minSelections={1}
          maxSelections={3}
          name="user-roles"
        />
      </div>

      {/* Always show buttons for now - remove hasChanges condition for debugging */}
      <div className="flex gap-2 pt-4 border-t border-gray-200">
        <Button
          onClick={handleSave}
          disabled={!hasChanges || isSaving || isLoading}
          className="button-primary"
        >
          {isSaving ? 'Saving...' : '↓ Save Changes'}
        </Button>
        <Button
          onClick={handleReset}
          disabled={isSaving || isLoading}
          className="button-neutral"
        >
          Reset
        </Button>
        {!hasChanges && (
          <span className="text-sm text-gray-500 self-center">
            No changes to save
          </span>
        )}
      </div>
    </div>
  );
}
