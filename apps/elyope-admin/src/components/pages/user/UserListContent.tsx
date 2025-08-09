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
} from '@app-test2/shared-components';

import Link from 'next/link';
import { useUserListControllerContext } from './UserListContext';
import { UserListFilter } from './UserListFilter';
import { useState } from 'react';
// sort state type is defined in context

export default function UserListContent() {
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
      header: 'Name',
      field: 'fullName' as keyof FullUser,
      isSortable: true,
      className: 'font-medium',
    },
    {
      header: 'Email',
      field: 'email' as keyof FullUser,
      isSortable: true,
    },
    {
      header: 'Roles',
      field: 'roles' as keyof FullUser,
      isSortable: false,
      displayCell: (user: FullUser) => (
        <div className="flex gap-1">
          {user.roles.map((role, index) => (
            <span
              key={index}
              className=" text-xs rounded-4 p-1  bg-el-blue-600 text-white"
            >
              {role}
            </span>
          ))}
        </div>
      ),
    },
    {
      header: 'Created',
      field: 'createdAt' as keyof User,
      isSortable: true,
      displayCell: (user: User) => (
        <span className="text-sm text-el-grey-500">
          {new Date(user.createdAt).toLocaleDateString()}
        </span>
      ),
    },
  ];

  const t = (key: string) => {
    const translations: Record<string, string> = {
      filter: 'Filter your data',
      search: 'Search',
      reset: 'Reset search',
    };
    return translations[key] || key;
  };

  return (
    <>
      <PageHeader
        title="Users"
        icon={<UserIcon className="w-full" />}
        action={
          <Link href="/create-user" className="button-primary min-w-40">
            + Create User
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
            t={t}
          />
        }
      />

      <div className="flex justify-end mt-4">
        <Pagination
          currentPage={currentPage}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
        />
      </div>

      <div className="">
        <DataGrid
          columns={columns}
          data={data}
          className="rounded-4  w-full"
          skeletonRowClass="!p-3"
          onSort={handleSort}
          sortField={sortState.field as keyof FullUser}
          sortDirection={sortState.direction}
          noDataMessage="No users found"
          isLoading={isSearching}
          loadingRows={5}
          rowActions={[
            {
              name: 'Edit',
              icon: <PencilIcon className="w-full h-full" />,
              onClick: (id) => {},
            },
            {
              className: 'hover:text-el-red-500',
              name: 'Delete',
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
          title="Delete user"
          message="Are you sure you want to delete this user? This action cannot be undone."
          confirmLabel="Delete"
          cancelLabel="Cancel"
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
    </>
  );
}
