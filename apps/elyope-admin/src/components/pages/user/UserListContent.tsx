'use client';

import { User, FullUser } from '@elyope/db';
import {
  PageHeader,
  UserIcon,
  DataGrid,
  Pagination,
  TrashIcon,
  PencilIcon,
  DialogConfirm,
  PageMain,
} from '@app-test2/shared-components';

import Link from 'next/link';
import { useUserListControllerContext } from './UserListContext';
import { UserListFilter } from './UserListFilter';
import { useState } from 'react';
import { cn } from '@app-test2/shared-components';
import { useTranslations } from 'next-intl';

// Role color mapping for display
const roleColors: Record<string, string> = {
  VETERINARIAN: 'bg-el-blue-400',
  INTERPRETER: 'bg-el-green-300',
  ADMIN: 'bg-el-yellow-300',
};

export default function UserListContent() {
  const t = useTranslations('Data.User.list');
  const tCommon = useTranslations('Data.Common');
  const tRoles = useTranslations('Data.User.roles');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const {
    data,
    pagination,
    currentPage,
    filter,
    sortState,
    isSearching,
    handlePageChange,
    handleKeywordChange,
    handleRoleChange,
    handleSearch,
    handleSort,
    handleReset,
    deleteUser,
  } = useUserListControllerContext();

  const isFilterEmpty = !filter.keyword && (!filter.role || filter.role === '');

  const columns = [
    {
      header: t('columns.name'),
      field: 'fullName' as keyof FullUser,
      isSortable: true,
      className: 'font-medium',
    },
    {
      header: tCommon('fields.email'),
      field: 'email' as keyof FullUser,
      isSortable: true,
    },
    {
      header: t('columns.roles'),
      field: 'roles' as keyof FullUser,
      isSortable: false,
      displayCell: (user: FullUser) => (
        <div className="flex gap-1">
          {user.roles.sort().map((role, index) => (
            <span
              key={index}
              className={cn(
                ' text-xs rounded-4 py-1 px-2 text-12  ',
                roleColors[role as string] || 'bg-gray-200'
              )}
            >
              {tRoles(role.toLowerCase())}
            </span>
          ))}
        </div>
      ),
    },
    {
      header: t('columns.created'),
      field: 'createdAt' as keyof User,
      isSortable: true,
      displayCell: (user: User) => (
        <span className="text-sm text-el-gray-500">
          {new Date(user.createdAt).toLocaleDateString()}
        </span>
      ),
    },
  ];

  // Translation function for filters - using common translations
  const tFilter = (key: string) => tCommon(key);

  return (
    <>
      <PageHeader
        title={t('title')}
        icon={<UserIcon className="w-full" />}
        action={
          <Link href="/user/create-user" className="button-primary min-w-40">
            {t('create_button')}
          </Link>
        }
        filters={
          <UserListFilter
            filter={filter}
            onKeywordChange={handleKeywordChange}
            onRoleChange={handleRoleChange}
            onSearch={handleSearch}
            onReset={handleReset}
            isSearching={isSearching}
            isFilterEmpty={isFilterEmpty}
            t={tFilter}
          />
        }
      />
      <PageMain className="p-0">
        {/* Pagination  ------------- */}
        <div className="flex justify-end mt-4 ">
          <Pagination
            currentPage={currentPage}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        </div>
        {/* DataGrid  ------------- */}
        <div className="">
          <DataGrid
            columns={columns}
            data={data}
            className="rounded-4  w-full"
            skeletonRowClass="!p-3"
            onSort={handleSort}
            sortField={sortState.field as keyof FullUser}
            sortDirection={sortState.direction}
            noDataMessage={t('no_data')}
            isLoading={isSearching}
            loadingRows={5}
            rowActions={[
              {
                name: t('actions.edit'),
                icon: <PencilIcon className="w-full h-full" />,
                onClick: (id) => {
                  const user = data.find((u) => String(u.id) === String(id));
                  if (user) {
                    window.location.href = `/user/${
                      user.externalId || user.id
                    }`;
                  }
                },
              },
              {
                className: 'hover:text-el-red-500',
                name: t('actions.delete'),
                icon: <TrashIcon className="w-full h-full" />,
                onClick: (id) => {
                  setSelectedUserId(String(id));
                  setConfirmOpen(true);
                },
              },
            ]}
          />
          <DialogConfirm
            open={confirmOpen}
            title={t('dialog.delete_title')}
            message={t('dialog.delete_message')}
            confirmLabel={t('actions.delete')}
            cancelLabel={tCommon('actions.cancel')}
            onCancel={() => {
              setConfirmOpen(false);
              setSelectedUserId(null);
            }}
            onConfirm={async () => {
              if (selectedUserId) {
                await deleteUser(selectedUserId);
              }
              setConfirmOpen(false);
              setSelectedUserId(null);
            }}
          />
        </div>
      </PageMain>
    </>
  );
}
