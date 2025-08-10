'use client';

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from 'react';
import { PaginationInfo, ListRequestType } from '@elyope/db';
import { getStructureList } from './StructureListController';

export type Structure = {
  id: string;
  name: string;
  description?: string | null;
  address1?: string | null;
  address2?: string | null;
  zipcode?: string | null;
  town?: string | null;
  phone?: string | null;
  mobile?: string | null;
  account_lastname?: string | null;
  account_firstname?: string | null;
  account_email?: string | null;
  is_structure_active: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
};

export type StructureFilter = {
  keyword?: string;
};

export type SortDirection = 'asc' | 'desc';
export type SortState = {
  field?: string;
  direction?: SortDirection;
};

type StructureListProviderProps = {
  children: ReactNode;
  _data: Structure[];
  _pagination: PaginationInfo;
};

type StructureListControllerContextValues = {
  data: Structure[];
  pagination: PaginationInfo;
  currentPage: number;
  filter: StructureFilter;
  sortState: SortState;
  isSearching: boolean;
  handlePageChange: (page: number) => void;
  handleKeywordChange: (value: string) => void;
  handleSearch: () => Promise<void>;
  handleSort: (field: string, direction: SortDirection) => void;
  handleReset: () => void;
};

export const StructureListControllerContext = createContext<
  StructureListControllerContextValues | undefined
>(undefined);

export const StructureListProvider = ({
  children,
  _data,
  _pagination,
}: StructureListProviderProps) => {
  const [data, setData] = useState<Structure[]>(_data);
  const [pagination, setPagination] = useState<PaginationInfo>(_pagination);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState<StructureFilter>({ keyword: '' });
  const [sortState, setSortState] = useState<SortState>({});
  const [isSearching, setIsSearching] = useState(false);

  const fetchStructures = useCallback(
    async (overrides?: Partial<ListRequestType>) => {
      setIsSearching(true);
      const baseParams: ListRequestType = {
        page: currentPage,
        search: filter.keyword || '',
        sort: sortState.field,
        sortDirection: sortState.direction,
      };

      const params: ListRequestType = {
        ...baseParams,
        ...(overrides || {}),
      };

      const { data, pagination } = await getStructureList(params);
      setData(data as Structure[]);
      setPagination(pagination);
      setIsSearching(false);
    },
    [currentPage, filter.keyword, sortState.field, sortState.direction]
  );

  const handlePageChange = useCallback(
    (page: number) => {
      setCurrentPage(page);
      fetchStructures({ page });
    },
    [fetchStructures]
  );

  const handleKeywordChange = useCallback(
    (value: string) => {
      setFilter((prev) => ({ ...prev, keyword: value }));
      setCurrentPage(1);
      fetchStructures({ page: 1, search: value || '' });
    },
    [fetchStructures]
  );

  const handleSearch = useCallback(async () => {
    setCurrentPage(1);
    await fetchStructures({ page: 1 });
  }, [fetchStructures]);

  const handleSort = useCallback(
    (field: string, direction: SortDirection) => {
      setSortState({ field, direction });
      fetchStructures({ sort: field, sortDirection: direction });
    },
    [fetchStructures]
  );

  const handleReset = useCallback(() => {
    setFilter({ keyword: '' });
    setSortState({});
    setCurrentPage(1);
    fetchStructures({
      page: 1,
      search: '',
      sort: undefined,
      sortDirection: undefined,
    });
  }, []);

  const contextValue: StructureListControllerContextValues = {
    data,
    pagination,
    currentPage,
    filter,
    sortState,
    isSearching,
    handlePageChange,
    handleKeywordChange,
    handleSearch,
    handleSort,
    handleReset,
  };

  return (
    <StructureListControllerContext.Provider value={contextValue}>
      {children}
    </StructureListControllerContext.Provider>
  );
};

export const useStructureListControllerContext = () => {
  const context = useContext(StructureListControllerContext);
  if (!context) {
    throw new Error(
      'useStructureListControllerContext must be used within a StructureListProvider'
    );
  }
  return context;
};
