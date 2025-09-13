'use client';

import {
  type ExamenFilter,
  ExamenStatus,
  Select,
  ListFilter,
} from '@app-test2/shared-components';
import { ExamStatus } from '@elyope/db';

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
        { label: tStatus('PENDING'), value: ExamStatus.PENDING },
        { label: tStatus('PROCESSING'), value: ExamStatus.PROCESSING },
        { label: tStatus('COMPLETED'), value: ExamStatus.COMPLETED },
        { label: tStatus('ARCHIVED'), value: ExamStatus.ARCHIVED },
      ]}
      value={value.status ?? ''}
      onChange={(value: string) => onFilterChange(value as ExamenStatus)}
    />
  );
}

export default function ExamenFilter() {
  const { filter, updateFilters, handleReset } = useExamenControllerContext();
  const t = useTranslations('Data.Common');
  return (
    <>
      {/* <div>{JSON.stringify(filter)}</div> */}
      <ListFilter
        filter={{ keyword: filter.keyword ?? '' }}
        onKeywordChange={(value: string) => updateFilters('keyword', value)}
        onSearch={() => undefined}
        onReset={handleReset}
        isFilterEmpty={!filter.status && !filter.keyword}
        t={t}
      >
        <ExamenStatusFilter
          onFilterChange={(value) => updateFilters('status', value)}
          value={{ status: filter.status as ExamenStatus }}
        />
      </ListFilter>
    </>
  );
}
