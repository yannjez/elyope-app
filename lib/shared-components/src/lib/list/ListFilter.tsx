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
    <div className="flex items-center gap-4  w-full justify-between">
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">{t('filter')}</span>
        <div className="flex items-center gap-2">
          <Input
            placeholder={`${t('search')}...`}
            icon={<SearchIcon className="h-4 w-4" />}
            iconPosition="right"
            value={localKeyword}
            onChange={handleKeywordChange}
          />
          {children}
        </div>
      </div>

      <div className="flex items-center gap-2">
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
  );
}
