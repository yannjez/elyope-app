'use client';

import { type ExamenFilter, ExamenStatus } from '@app-test2/shared-components';

import { Select, ListFilter } from '@/components/shared';

import { useExamenControllerContext } from './ExamenContext';

type ExamenFilterProps = {
  onFilterChange: (value: ExamenStatus) => void;
  value: ExamenFilter;
};

function ExamenStatusFilter({ onFilterChange, value }: ExamenFilterProps) {
  return (
    <Select
      options={[
        { label: 'Tous', value: '' },
        { label: 'En attente', value: 'pending' },
        { label: 'En cours', value: 'processing' },
        { label: 'Terminé', value: 'completed' },
        { label: 'Archivé', value: 'archived' },
      ]}
      value={value.status ?? ''}
      onChange={(value) => onFilterChange(value as ExamenStatus)}
    />
  );
}

export default function ExamenFilter() {
  const { filters, updateFilters } = useExamenControllerContext();

  return (
    <>
      {/* <div>{JSON.stringify(filters)}</div> */}
      <ListFilter
        filter={{ keyword: filters.keyword ?? '' }}
        onKeywordChange={(value: string) => updateFilters('keyword', value)}
        onSearch={() => {}}
        onReset={() => {
          updateFilters('status', '');
          updateFilters('keyword', '');
        }}
        isFilterEmpty={!filters.status && !filters.keyword}
      >
        <ExamenStatusFilter
          onFilterChange={(value) => updateFilters('status', value)}
          value={filters}
        />
      </ListFilter>
    </>
  );
}
