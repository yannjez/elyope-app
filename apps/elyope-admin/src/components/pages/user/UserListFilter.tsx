'use client';

import React, { useState, useEffect } from 'react';
import {
  ListFilter,
  Button,
  type BaseFilter,
} from '@app-test2/shared-components';
import { useTranslations } from 'next-intl';

type UserFilter = BaseFilter & {
  role?: string;
};

type UserListFilterProps = {
  filter: UserFilter;
  onKeywordChange: (value: string) => void;
  onRoleChange: (role: string) => void;
  onSearch: () => void;
  onReset: () => void;
  isSearching?: boolean;
  isFilterEmpty?: boolean;
  t: (key: string) => string;
};

// Moved ROLE_OPTIONS inside component to access translations

export function UserListFilter({
  filter,
  onKeywordChange,
  onRoleChange,
  onSearch,
  onReset,
  isSearching,
  isFilterEmpty,
  t,
}: UserListFilterProps) {
  const tList = useTranslations('Data.User.list');
  const tRoles = useTranslations('Data.User.roles');

  const ROLE_OPTIONS = [
    { value: 'ALL', label: tList('filter.role_all') },
    { value: 'ADMIN', label: tRoles('admin') },
    { value: 'INTERPRETER', label: tRoles('interpreter') },
  ];

  const [selectedRole, setSelectedRole] = useState<string>(
    filter.role || 'ALL'
  );

  // Sync local state with filter prop
  useEffect(() => {
    setSelectedRole(filter.role || 'ALL');
  }, [filter.role]);

  const handleRoleClick = (role: string) => {
    setSelectedRole(role);
    onRoleChange(role === 'ALL' ? '' : role);
  };

  const roleFilterComponent = (
    <>
      <span className="text-sm text-gray-600 min-w-[60px]">
        {tList('filter.roles_label')}
      </span>
      <div className="flex items-center gap-1">
        {ROLE_OPTIONS.map((role) => (
          <Button
            key={role.value}
            className={`text-xs px-3 py-1 rounded-4 transition-all ${
              selectedRole === role.value ? 'button-primary' : 'button-neutral'
            }`}
            onClick={() => handleRoleClick(role.value)}
          >
            {role.label}
          </Button>
        ))}
      </div>
    </>
  );

  return (
    <ListFilter
      filter={filter}
      onKeywordChange={onKeywordChange}
      onSearch={onSearch}
      onReset={onReset}
      isSearching={isSearching}
      isFilterEmpty={isFilterEmpty}
      t={t}
    >
      {roleFilterComponent}
    </ListFilter>
  );
}
