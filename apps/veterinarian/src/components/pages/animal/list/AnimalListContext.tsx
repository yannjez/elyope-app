'use client';

import { AnimalResquest } from '@/types/animals';
import {
  Animal,
  AnimalBreed,
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

type AnimalListContextProps = {
  children: ReactNode;
  _breeds: AnimalBreed[];
  _animals: Animal[];
  _pagination: PaginationInfo;
};

type AnimalListContextValues = {
  animals: Animal[];
  breeds: AnimalBreed[];
  pagination: PaginationInfo;
  currentPage: number;
  isSearching: boolean;
  sortState: SortState;
  handleSort: (field: string, direction: SortDirection) => void;
  handleReset: () => void;
  handlePageChange: (page: number) => void;
  handleKeywordChange: (value: string) => void;
  handleSearch: () => Promise<void>;
};

const AnimalListContext = createContext<AnimalListContextValues | undefined>(
  undefined
);

export const AnimalListProvider = ({
  children,
  _breeds,
  _animals,
  _pagination,
}: AnimalListContextProps) => {
  const [animals, setAnimals] = useState<Animal[]>(_animals);
  const [pagination, setPagination] = useState<PaginationInfo>(_pagination);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState<AnimalResquest>({ search: '' });
  const [sortState, setSortState] = useState<SortState>({});
  const [isSearching, setIsSearching] = useState(false);

  const fetchAnimals = useCallback(
    async (overrides?: Partial<AnimalResquest>) => {
      setIsSearching(true);
      const baseParams: AnimalResquest = {
        page: currentPage,
        search: filter.search || '',
        sort: sortState.field,
        sortDirection: sortState.direction,
      };
    },
    [currentPage, filter.search, sortState.field, sortState.direction]
  );

  const handlePageChange = useCallback(
    (page: number) => {
      setCurrentPage(page);
      fetchAnimals({ page });
    },
    [fetchAnimals]
  );

  const handleKeywordChange = useCallback(
    (value: string) => {
      setFilter((prev) => ({ ...prev, search: value }));
      setCurrentPage(1);
      fetchAnimals({ page: 1, search: value || '' });
    },
    [fetchAnimals]
  );

  const handleSearch = useCallback(async () => {
    setCurrentPage(1);
    await fetchAnimals({ page: 1 });
  }, [fetchAnimals]);

  const handleSort = useCallback(
    (field: string, direction: SortDirection) => {
      setSortState({ field, direction });
      fetchAnimals({ sort: field, sortDirection: direction });
    },
    [fetchAnimals]
  );

  const handleReset = useCallback(() => {
    setFilter({ search: '' });
    setSortState({});
    setCurrentPage(1);
    fetchAnimals({ page: 1, search: '' });
  }, [fetchAnimals]);

  const contextValue: AnimalListContextValues = {
    breeds: _breeds,
    animals,
    currentPage,
    pagination,
    isSearching,
    sortState,
    handleSort,
    handleReset,
    handlePageChange,
    handleKeywordChange,
    handleSearch,
  };

  return (
    <AnimalListContext.Provider value={contextValue}>
      {children}
    </AnimalListContext.Provider>
  );
};

export const useAnimalListContext = () => {
  const context = useContext(AnimalListContext);
  if (!context) {
    throw new Error(
      'useAnimalListContext must be used within a AnimalListProvider'
    );
  }
  return context;
};
