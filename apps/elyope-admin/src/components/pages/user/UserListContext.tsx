'use client';

import {
  createContext,
  ReactNode,
  useContext,
  useState,
  useCallback,
} from 'react';
import {
  FullUser,
  PaginationInfo,
  ListRequestType,
  UserType,
} from '@elyope/db';
import { deleteUser, getUserList, updateUserRoles } from './UserListController';

export type UserFilter = {
  keyword?: string;
  role?: string;
};

export type UserFilterKeys = keyof UserFilter;

export type SortDirection = 'asc' | 'desc';

export type SortState = {
  field?: string;
  direction?: SortDirection;
};

type UserListProviderProps = {
  children: ReactNode;
  _data: FullUser[];
  _pagination: PaginationInfo;
};

type UserListControllerContextValues = {
  data: FullUser[];
  pagination: PaginationInfo;
  currentPage: number;
  filter: UserFilter;
  sortState: SortState;
  isSearching: boolean;
  handlePageChange: (page: number) => void;
  handleKeywordChange: (value: string) => void;
  handleRoleChange: (role: string) => void;
  handleSearch: () => Promise<void>;
  handleSort: (field: string, direction: SortDirection) => void;
  handleReset: () => void;
  deleteUser: (id: string) => Promise<void>;
  updateRoles: (externalId: string, roles: UserType[]) => Promise<void>;
};

export const UserListControllerContext = createContext<
  UserListControllerContextValues | undefined
>(undefined);

export const UserListProvider = ({
  children,
  _data,
  _pagination,
}: UserListProviderProps) => {
  const [data, setData] = useState<FullUser[]>(_data);
  const [pagination, setPagination] = useState<PaginationInfo>(_pagination);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState<UserFilter>({ keyword: '', role: '' });
  const [sortState, setSortState] = useState<SortState>({});
  const [isSearching, setIsSearching] = useState(false);

  const fetchUsers = useCallback(
    async (overrides?: Partial<ListRequestType>) => {
      setIsSearching(true);
      const baseParams: ListRequestType = {
        page: currentPage,
        search: filter.keyword || '',
        role: filter.role || '',
        sort: sortState.field,
        sortDirection: sortState.direction,
      };

      const params: ListRequestType = {
        ...baseParams,
        ...(overrides || {}),
      };

      const { data, pagination } = await getUserList(params);
      setData(data);
      setPagination(pagination);
      setIsSearching(false);
    },
    [
      currentPage,
      filter.keyword,
      filter.role,
      sortState.field,
      sortState.direction,
    ]
  );

  const handlePageChange = useCallback(
    (page: number) => {
      setCurrentPage(page);
      fetchUsers({ page });
    },
    [fetchUsers]
  );

  const handleKeywordChange = useCallback(
    (value: string) => {
      setFilter((prev) => ({ ...prev, keyword: value }));
      setCurrentPage(1);
      fetchUsers({ page: 1, search: value || '' });
    },
    [fetchUsers]
  );

  const handleRoleChange = useCallback(
    (role: string) => {
      setFilter((prev) => ({ ...prev, role }));
      setCurrentPage(1);
      fetchUsers({ page: 1, role });
    },
    [fetchUsers]
  );

  const handleSearch = useCallback(async () => {
    setCurrentPage(1);
    await fetchUsers({ page: 1 });
  }, [fetchUsers]);

  const handleSort = useCallback(
    (field: string, direction: SortDirection) => {
      setSortState({ field, direction });
      fetchUsers({ sort: field, sortDirection: direction });
    },
    [fetchUsers]
  );

  const handleReset = useCallback(() => {
    setFilter({ keyword: '', role: '' });
    setSortState({});
    setCurrentPage(1);
    fetchUsers({
      page: 1,
      search: '',
      role: '',
      sort: undefined,
      sortDirection: undefined,
    });
  }, []);

  const handleDeleteUser = useCallback(
    async (id: string) => {
      await deleteUser(id);
      await fetchUsers({ page: currentPage });
    },
    [fetchUsers, currentPage]
  );

  const handleUpdateRoles = useCallback(
    async (externalId: string, roles: UserType[]) => {
      await updateUserRoles(externalId, roles);
      await fetchUsers({ page: currentPage });
    },
    [fetchUsers, currentPage]
  );

  const contextValue: UserListControllerContextValues = {
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
    deleteUser: handleDeleteUser,
    updateRoles: handleUpdateRoles,
  };

  return (
    <UserListControllerContext.Provider value={contextValue}>
      {children}
    </UserListControllerContext.Provider>
  );
};

export const useUserListControllerContext = () => {
  const context = useContext(UserListControllerContext);
  if (!context) {
    throw new Error(
      'useUserListControllerContext must be used within a UserListProvider'
    );
  }
  return context;
};
