'use client';

import {
  examenClassName,
  DataGrid,
  type ExamenStatus,
  PageMain,
  Pagination,
} from '@app-test2/shared-components';

import { cn } from '@app-test2/shared-components';
import { useTranslations } from 'next-intl';
import { useExamenControllerContext } from './ExamenContext';
import { ExamStatus } from '@elyope/db';

export default function ExamenList() {
  const t = useTranslations('Data.Examen');

  const {
    exams,
    pagination,
    currentPage,
    handlePageChange,
    isSearching,
    sortState,
    handleSort,
  } = useExamenControllerContext();

  const data = exams.map((exam) => ({
    ...exam,
    date: exam.requestedAt?.toLocaleDateString() || '-',
    status: exam.status,
    animal: exam.animal
      ? `${exam.animal.name} (${exam.animal.breed.name_fr})`
      : '-',
    vet: exam.interpreter?.externalId || '-',
    comment: exam.comments || '-',
    rowClass:
      exam.status === ExamStatus.ARCHIVED
        ? 'bg-el-grey-100 text-el-grey-500'
        : 'bg-white',
  }));

  return (
    <PageMain className="p-0">
      <div className="flex items-center justify-between mt-4">
        <div className="flex-1" />
        <Pagination
          currentPage={currentPage}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
        />
      </div>

      <div className="mt-2">
        <DataGrid
          columns={[
            {
              header: t('columns.date'),
              field: 'requestedAt',
              isSortable: true,
              displayCell: (row) => row.date,
            },
            {
              header: t('columns.status'),
              field: 'status',
              isSortable: true,
              className: '!p-0',
              displayCell: (row) => {
                const statusKey = row.status.toLowerCase() as ExamenStatus;
                return (
                  <div
                    className={cn(
                      'px-3 py-2 rounded-4 ',
                      examenClassName[statusKey]?.[0] || 'bg-gray-200'
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          'w-2.5 h-2.5 rounded-full',
                          examenClassName[statusKey]?.[1] || 'bg-gray-400'
                        )}
                      />
                      <span className=" ">{t(`status.${row.status}`)}</span>
                    </div>
                  </div>
                );
              },
            },
            {
              header: t('columns.animal'),
              field: 'animalName',
              isSortable: true,
              displayCell: (row) => row.animal,
            },
            {
              header: t('columns.interpreter'),
              field: 'vet',
              isSortable: false,
              displayCell: (row) => row.vet,
            },
            {
              header: t('columns.comment'),
              field: 'comments',
              displayCell: (row) => (
                <div className="xl:whitespace-normal">
                  <span
                    className=" block overflow-hidden text-ellipsis whitespace-nowrap max-w-[200px]"
                    title={row.comment}
                  >
                    {row.comment}
                  </span>
                </div>
              ),
            },
          ]}
          data={data}
          className="rounded-4 w-full"
          skeletonRowClass="!p-3"
          onSort={handleSort}
          sortField={(sortState.field as keyof (typeof data)[0]) ?? undefined}
          sortDirection={sortState.direction}
          noDataMessage={t('no_data')}
          isLoading={isSearching}
          loadingRows={5}
        />
      </div>
    </PageMain>
  );
}
