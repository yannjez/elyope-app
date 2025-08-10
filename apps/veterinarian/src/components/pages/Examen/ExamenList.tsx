'use client';

import {
  examenClassName,
  DataGrid,
  type ExamenStatus,
} from '@app-test2/shared-components';

import { cn } from '@app-test2/shared-components';
import { useTranslations } from 'next-intl';

export default function ExamenList() {
  const t = useTranslations('Data.Examen');

  const rows = [
    {
      date: '2025/06/21',
      status: 'pending',
      animal: 'Fox terrier',
      vet: 'lea.achard@complice.com',
      comment: '-',
    },
    {
      date: '2025/05/18',
      status: 'completed',
      animal: 'Berger Allemand',
      vet: 'bernard.hartiche@saintrcoh.com',
      comment: '-',
    },
    {
      date: '2025/05/18',
      status: 'processing',
      animal: 'Berger Allemand',
      vet: 'bernard.hartiche@saintrcoh.com',
      comment: '-',
    },
    {
      date: '2025/05/18',
      status: 'archived',
      animal: 'Berger Allemand',
      vet: 'bernard.hartiche@saintrcoh.com',
      comment: '-',
    },
    // ... more rows
  ];

  const data = rows.map((row) => ({
    ...row,
    rowClass:
      row.status === 'archived'
        ? 'bg-el-grey-100 text-el-grey-500'
        : 'bg-white',
  }));

  return (
    <DataGrid
      columns={[
        { header: t('columns.date'), field: 'date', isSortable: true },
        {
          header: t('columns.status'),
          field: 'status',
          isSortable: true,
          className: '!p-0',
          displayCell: (row) => (
            <div
              className={cn(
                'px-3 py-2 rounded-4 ',
                examenClassName[row.status as ExamenStatus][0]
              )}
            >
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    'w-2.5 h-2.5 rounded-full',
                    examenClassName[row.status as ExamenStatus][1]
                  )}
                />
                <span className=" ">{t(`status.${row.status}`)}</span>
              </div>
            </div>
          ),
        },
        { header: t('columns.animal'), field: 'animal', isSortable: true },
        { header: t('columns.interpreter'), field: 'vet', isSortable: true },
        { header: t('columns.comment'), field: 'comment' },
      ]}
      data={data}
    />
  );
}
