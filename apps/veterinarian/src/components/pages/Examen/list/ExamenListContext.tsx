'use client';

import { type ExamenStatus } from '@app-test2/shared-components';
import {
  ExamWithRelations,
  PaginationInfo,
  SortDirection,
  SortState,
} from '@elyope/db';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from 'react';
import { getExams } from '../../ExamenController';
import { ExamenRequest } from '../../ExamenController';

export type ExamenFilterKeys = 'status' | 'keyword';

type ExamenControllerContextProps = {
  children: ReactNode;
  _exams: ExamWithRelations[];
  _pagination: PaginationInfo;
  structureId: string;
};

type ExamenControllerContextValues = {
  exams: ExamWithRelations[];
  pagination: PaginationInfo;
  currentPage: number;
  isSearching: boolean;
  sortState: SortState;
  filter: ExamenRequest;
  updateFilters: (key: ExamenFilterKeys, value: string | ExamenStatus) => void;
  handleSort: (field: string, direction: SortDirection) => void;
  handleReset: () => void;
  handlePageChange: (page: number) => void;
  handleSearch: () => Promise<void>;
};

export const ExamenControllerContext = createContext<
  ExamenControllerContextValues | undefined
>(undefined);

export const ExamenControllerProvider = ({
  children,
  _exams,
  _pagination,
  structureId,
}: ExamenControllerContextProps) => {
  const [exams, setExams] = useState<ExamWithRelations[]>(_exams);
  const [pagination, setPagination] = useState<PaginationInfo>(_pagination);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState<ExamenRequest>({
    keyword: '',
    structureId: structureId,
  });
  const [sortState, setSortState] = useState<SortState>({});
  const [isSearching, setIsSearching] = useState(false);

  const fetchExams = useCallback(
    async (overrides?: Partial<ExamenRequest>) => {
      setIsSearching(true);
      const baseParams: ExamenRequest = {
        page: currentPage,
        keyword: filter.keyword || '',
        sort: sortState.field,
        sortDirection: sortState.direction,
        status: filter.status,
        structureId: filter.structureId,
        ...overrides,
      };

      try {
        const result = await getExams(baseParams);
        setExams(result.data);
        setPagination(result.pagination);
      } catch (error) {
        console.error('Error fetching exams:', error);
      } finally {
        setIsSearching(false);
      }
    },
    [
      currentPage,
      filter.keyword,
      filter.status,
      filter.structureId,
      sortState.field,
      sortState.direction,
    ]
  );

  const handlePageChange = useCallback(
    (page: number) => {
      setCurrentPage(page);
      fetchExams({ page });
    },
    [fetchExams]
  );

  const updateFilters = useCallback(
    (key: ExamenFilterKeys, value: string | ExamenStatus) => {
      setFilter((prev) => ({ ...prev, [key]: value }));
      setCurrentPage(1);
      fetchExams({ page: 1, [key]: value });
    },
    [fetchExams]
  );

  const handleSearch = useCallback(async () => {
    setCurrentPage(1);
    await fetchExams({ page: 1 });
  }, [fetchExams]);

  const handleSort = useCallback(
    (field: string, direction: SortDirection) => {
      setSortState({ field, direction });
      fetchExams({ sort: field, sortDirection: direction });
    },
    [fetchExams]
  );

  const handleReset = useCallback(() => {
    setFilter({ keyword: '', structureId: structureId });
    setSortState({});
    setCurrentPage(1);
    fetchExams({ page: 1, keyword: '', status: undefined });
  }, [fetchExams, structureId]);

  const contextValue: ExamenControllerContextValues = {
    exams,
    currentPage,
    pagination,
    isSearching,
    sortState,
    filter,
    updateFilters,
    handleSort,
    handleReset,
    handlePageChange,
    handleSearch,
  };

  return (
    <ExamenControllerContext.Provider value={contextValue}>
      {children}
    </ExamenControllerContext.Provider>
  );
};

export const useExamenControllerContext = () => {
  const context = useContext(ExamenControllerContext);
  if (!context) {
    throw new Error(
      'useExamenControllerContext must be used within a ExamenControllerProvider'
    );
  }
  return context;
};
