'use client';

import {
  type ExamenFilter,
  ExamenStatus,
  Select,
  ListFilter,
} from '@app-test2/shared-components';

import { useExamenControllerContext } from './ExamenContext';
import { useTranslations } from 'next-intl';

type ExamenFilterProps = {
  onFilterChange: (value: ExamenStatus) => void;
  value: ExamenFilter;
};

function ExamenStatusFilter({ onFilterChange, value }: ExamenFilterProps) {
  const tStatus = useTranslations('Data.Examen.status');
  const tCommon = useTranslations('Data.Common');
  return (
    <Select
      options={[
        { label: tCommon('all'), value: '' },
        { label: tStatus('pending'), value: 'pending' },
        { label: tStatus('processing'), value: 'processing' },
        { label: tStatus('completed'), value: 'completed' },
        { label: tStatus('archived'), value: 'archived' },
      ]}
      value={value.status ?? ''}
      onChange={(value: string) => onFilterChange(value as ExamenStatus)}
    />
  );
}

export default function ExamenFilter() {
  const { filters, updateFilters } = useExamenControllerContext();
  const t = useTranslations('Data.Common');
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
        t={t}
      >
        <ExamenStatusFilter
          onFilterChange={(value) => updateFilters('status', value)}
          value={filters}
        />
      </ListFilter>
    </>
  );
}
