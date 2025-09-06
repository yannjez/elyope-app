'use client';

import { AnimalResquest } from '@/types/animals';
import {
  Animal,
  AnimalBreed,
  AnimalSpecies,
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
import { getAnimals } from '@/components/pages/animal/AnimalController';

type AnimalListContextProps = {
  children: ReactNode;
  _breeds: AnimalBreed[];
  _animals: Animal[];
  _pagination: PaginationInfo;
  structureId: string;
};

type AnimalListContextValues = {
  animals: Animal[];
  breeds: AnimalBreed[];
  pagination: PaginationInfo;
  currentPage: number;
  isSearching: boolean;
  sortState: SortState;
  filter: AnimalResquest;
  handleSort: (field: string, direction: SortDirection) => void;
  handleReset: () => void;
  handlePageChange: (page: number) => void;
  handleKeywordChange: (value: string) => void;
  handleSpeciesChange: (species?: AnimalSpecies) => void;
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
  structureId,
}: AnimalListContextProps) => {
  const [animals, setAnimals] = useState<Animal[]>(_animals);
  const [pagination, setPagination] = useState<PaginationInfo>(_pagination);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState<AnimalResquest>({
    search: '',
    structureId: structureId,
  });
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
        type: filter.type,
        structureId: filter.structureId,
        ...overrides,
      };

      try {
        // Here we would call the actual API
        // For now, we'll just simulate the call

        const result = await getAnimals(baseParams);
        setAnimals(result.data);
        setPagination(result.pagination);
      } catch (error) {
        console.error('Error fetching animals:', error);
      } finally {
        setIsSearching(false);
      }
    },
    [
      currentPage,
      filter.search,
      filter.type,
      filter.structureId,
      sortState.field,
      sortState.direction,
    ]
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

  const handleSpeciesChange = useCallback(
    (species?: AnimalSpecies) => {
      // For single species selection, we take the first one or undefined
      if (species === filter.type) return;

      const filterChange = { ...filter, type: species, page: 1 };
      setFilter(filterChange);
      setCurrentPage(1);
      fetchAnimals(filterChange);
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
    setFilter({ search: '', structureId: structureId });
    setSortState({});
    setCurrentPage(1);
    fetchAnimals({ page: 1, search: '', type: undefined });
  }, [fetchAnimals, structureId]);

  const contextValue: AnimalListContextValues = {
    breeds: _breeds,
    animals,
    currentPage,
    pagination,
    isSearching,
    sortState,
    filter,
    handleSort,
    handleReset,
    handlePageChange,
    handleKeywordChange,
    handleSpeciesChange,
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
