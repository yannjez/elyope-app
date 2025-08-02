'use client';

import { User, PaginationInfo, FullUser } from '@elyope/db';
import {
  PageHeader,
  UserIcon,
  Button,
  DataGrid,
} from '@app-test2/shared-components';
import { useState, useCallback } from 'react';
import { getUserList } from './UserListController';
import { UserListFilter } from './UserListFilter';
import Link from 'next/link';

type UserFilter = {
  keyword?: string;
  role?: string;
};

export default function UserListContent({
  _data,
  _pagination,
}: {
  _data: FullUser[];
  _pagination: PaginationInfo;
}) {
  const [data, setData] = useState<FullUser[]>(_data);
  const [pagination, setPagination] = useState<PaginationInfo>(_pagination);
  const [filter, setFilter] = useState<UserFilter>({ keyword: '', role: '' });
  const [isSearching, setIsSearching] = useState(false);

  const handleKeywordChange = useCallback(
    (value: string) => {
      setFilter((prev) => ({ ...prev, keyword: value }));
      setIsSearching(true);
      getUserList({
        search: value || '',
        role: filter.role || '',
      }).then(({ data, pagination }) => {
        setData(data);
        setPagination(pagination);
        setIsSearching(false);
      });
    },
    [filter.role]
  );

  const handleRoleChange = useCallback(
    (role: string) => {
      setFilter((prev) => ({ ...prev, role }));
      setIsSearching(true);
      getUserList({
        search: filter.keyword || '',
        role: role,
      }).then(({ data, pagination }) => {
        setData(data);
        setPagination(pagination);
        setIsSearching(false);
      });
    },
    [filter.keyword]
  );

  const handleSearch = async () => {
    setIsSearching(true);
    getUserList({
      search: filter.keyword || '',
      role: filter.role || '',
    }).then(({ data, pagination }) => {
      setData(data);
      setPagination(pagination);
      setIsSearching(false);
    });
  };

  const handleSort = (field: string, direction: 'asc' | 'desc') => {
    getUserList({
      search: filter.keyword || '',
      role: filter.role || '',
      sort: field,
      sortDirection: direction,
    }).then(({ data, pagination }) => {
      setData(data);
      setPagination(pagination);
      setIsSearching(false);
    });
  };

  const handleReset = useCallback(() => {
    setFilter({ keyword: '', role: '' });
    getUserList({}).then(({ data, pagination }) => {
      setData(data);
      setPagination(pagination);
      setIsSearching(false);
    });
  }, []);

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
    {
      header: 'Actions',
      field: 'id' as keyof User,
      isSortable: false,
      displayCell: (user: User) => (
        <div className="flex gap-2">
          <Button
            className="button-primary-inverse text-xs px-2 py-1"
            onClick={() => console.log('Edit user:', user.id)}
          >
            Edit
          </Button>
          <Button
            className="button-destructive text-xs px-2 py-1"
            onClick={() => console.log('Delete user:', user.id)}
          >
            Delete
          </Button>
        </div>
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

      <div className="mt-4">
        <DataGrid
          columns={columns}
          data={data}
          className="rounded-4 "
          onSort={handleSort}
        />
        <div className="mt-4 p-4 bg-gray-100 rounded-4">
          <h3 className="font-medium mb-2">Current Filter State:</h3>
          <pre className="text-sm">{JSON.stringify(filter, null, 2)}</pre>
        </div>

        {pagination?.totalPages > 1 && (
          <div className="mt-4 flex justify-center items-center gap-2">
            <span className="text-sm text-el-grey-500">
              Page 1 of {pagination.totalPages}
            </span>
            {/* TODO: Add pagination controls */}
          </div>
        )}
      </div>
    </>
  );
}
