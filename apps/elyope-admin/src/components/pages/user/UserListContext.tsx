'use client';

import {
  createContext,
  ReactNode,
  useContext,
  useState,
  useCallback,
} from 'react';
import { FullUser, PaginationInfo } from '@elyope/db';
import { getUserList } from './UserListController';

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

  const handlePageChange = useCallback(
    (page: number) => {
      setCurrentPage(page);
      setIsSearching(true);
      getUserList({
        page,
        search: filter.keyword || '',
        role: filter.role || '',
        sort: sortState.field,
        sortDirection: sortState.direction,
      }).then(({ data, pagination }) => {
        setData(data);
        setPagination(pagination);
        setIsSearching(false);
      });
    },
    [filter.keyword, filter.role, sortState.field, sortState.direction]
  );

  const handleKeywordChange = useCallback(
    (value: string) => {
      setFilter((prev) => ({ ...prev, keyword: value }));
      setCurrentPage(1);
      setIsSearching(true);
      getUserList({
        page: 1,
        search: value || '',
        role: filter.role || '',
        sort: sortState.field,
        sortDirection: sortState.direction,
      }).then(({ data, pagination }) => {
        setData(data);
        setPagination(pagination);
        setIsSearching(false);
      });
    },
    [filter.role, sortState.field, sortState.direction]
  );

  const handleRoleChange = useCallback(
    (role: string) => {
      setFilter((prev) => ({ ...prev, role }));
      setCurrentPage(1);
      setIsSearching(true);
      getUserList({
        page: 1,
        search: filter.keyword || '',
        role: role,
        sort: sortState.field,
        sortDirection: sortState.direction,
      }).then(({ data, pagination }) => {
        setData(data);
        setPagination(pagination);
        setIsSearching(false);
      });
    },
    [filter.keyword, sortState.field, sortState.direction]
  );

  const handleSearch = useCallback(async () => {
    setCurrentPage(1);
    setIsSearching(true);
    getUserList({
      page: 1,
      search: filter.keyword || '',
      role: filter.role || '',
      sort: sortState.field,
      sortDirection: sortState.direction,
    }).then(({ data, pagination }) => {
      setData(data);
      setPagination(pagination);
      setIsSearching(false);
    });
  }, [filter.keyword, filter.role, sortState.field, sortState.direction]);

  const handleSort = useCallback(
    (field: string, direction: SortDirection) => {
      setSortState({ field, direction });
      setIsSearching(true);
      getUserList({
        page: currentPage,
        search: filter.keyword || '',
        role: filter.role || '',
        sort: field,
        sortDirection: direction,
      }).then(({ data, pagination }) => {
        setData(data);
        setPagination(pagination);
        setIsSearching(false);
      });
    },
    [currentPage, filter.keyword, filter.role]
  );

  const handleReset = useCallback(() => {
    setFilter({ keyword: '', role: '' });
    setSortState({});
    setCurrentPage(1);
    setIsSearching(true);
    getUserList({ page: 1 }).then(({ data, pagination }) => {
      setData(data);
      setPagination(pagination);
      setIsSearching(false);
    });
  }, []);

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
