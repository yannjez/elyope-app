'use client';

import React, { useEffect, useState } from 'react';
import { type BaseFilter } from '../types/Base';
import Input from '../forms/Input';
import SearchIcon from '../icons/search';
import Button from '../forms/Button';

type BaseFilterProps<T extends BaseFilter> = {
  filter: T;
  onKeywordChange: (value: string) => void;
  onSearch: () => void;
  onReset: () => void;
  children?: React.ReactNode;
  isSearching?: boolean;
  debounceMs?: number;
  isFilterEmpty?: boolean;
  t: (key: string) => string;
};

/**
 * Generic ListFilter component that can be extended with custom filters
 *
 * @example
 * ```tsx
 * // Basic usage
 * <ListFilter
 *   filter={filter}
 *   onKeywordChange={handleKeywordChange}
 *   onSearch={handleSearch}
 *   onReset={handleReset}
 *   t={t}
 * />
 *
 * // With custom filters
 * <ListFilter
 *   filter={filter}
 *   onKeywordChange={handleKeywordChange}
 *   onSearch={handleSearch}
 *   onReset={handleReset}
 *   customFilters={
 *     <div className="flex items-center gap-2">
 *       <span>Status:</span>
 *       <Button onClick={() => handleStatusChange('active')}>Active</Button>
 *       <Button onClick={() => handleStatusChange('inactive')}>Inactive</Button>
 *     </div>
 *   }
 *   t={t}
 * />
 * ```
 */
export function ListFilter<T extends BaseFilter>({
  filter,
  isFilterEmpty,
  onKeywordChange,
  onSearch,
  onReset,
  children,
  isSearching,
  debounceMs = 300,
  t,
}: BaseFilterProps<T>) {
  const [localKeyword, setLocalKeyword] = useState(filter.keyword || '');

  t = t || ((key: string) => key);

  // Debounce effect for keyword changes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localKeyword !== filter.keyword) {
        onKeywordChange(localKeyword);
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [localKeyword, onKeywordChange, debounceMs, filter.keyword]);

  // Sync local state with filter prop
  useEffect(() => {
    setLocalKeyword(filter.keyword || '');
  }, [filter.keyword]);

  const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalKeyword(e.target.value);
  };

  return (
    <div className="flex flex-col gap-4 w-full  ">
      {/* Custom Filters */}

      {/* Search and Actions */}
      <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 w-full justify-between">
        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 ">
          <span className="text-sm text-gray-600">{t('filter')}</span>
          <div className="flex flex-col md:flex-row md:items-center gap-2 ">
            <Input
              placeholder={`${t('search')}...`}
              icon={<SearchIcon className="h-4 w-4" />}
              iconPosition="right"
              value={localKeyword}
              className="w-full md:w-auto"
              onChange={handleKeywordChange}
              type="search"
            />
            <div className="flex flex-col md:flex-row md:items-center gap-2 ">
              {children}
            </div>
          </div>
        </div>

        <div className="flex md:items-center gap-2 ">
          <Button
            className="button-neutral"
            disabled={isFilterEmpty ?? false}
            onClick={onReset}
          >
            {t('reset')}
          </Button>
          <Button
            className="button-neutral"
            onClick={onSearch}
            disabled={isSearching}
          >
            {t('search')}
          </Button>
        </div>
      </div>
    </div>
  );
}
