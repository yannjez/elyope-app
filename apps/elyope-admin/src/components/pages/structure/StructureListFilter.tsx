'use client';

import React from 'react';
import { ListFilter, type BaseFilter } from '@app-test2/shared-components';

type StructureFilter = BaseFilter;

type StructureListFilterProps = {
  filter: StructureFilter;
  onKeywordChange: (value: string) => void;
  onSearch: () => void;
  onReset: () => void;
  isSearching?: boolean;
  isFilterEmpty?: boolean;
  t: (key: string) => string;
};

export function StructureListFilter({
  filter,
  onKeywordChange,
  onSearch,
  onReset,
  isSearching,
  isFilterEmpty,
  t,
}: StructureListFilterProps) {
  return (
    <ListFilter
      filter={filter}
      onKeywordChange={onKeywordChange}
      onSearch={onSearch}
      onReset={onReset}
      isSearching={isSearching}
      isFilterEmpty={isFilterEmpty}
      t={t}
    />
  );
}

export default StructureListFilter;
