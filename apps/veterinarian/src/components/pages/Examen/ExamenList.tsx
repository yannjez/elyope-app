'use client';

import { type ExamenStatus } from '@app-test2/shared-components';
import { DataGrid } from '@/components/shared';

import { cn } from '../../../../../../lib/shared-components/src/lib/utils/cn';

export default function ExamenList() {
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
    // ... more rows
  ];

  const className: Record<ExamenStatus, [string, string]> = {
    pending: ['bg-el-blue-200 ', 'bg-el-blue-500'],
    processing: ['bg-yellow-300', 'bg-yellow-500'],
    completed: ['bg-el-green-300 ', 'bg-el-green-500'],
    archived: ['bg-grey-200 ', 'bg-el-grey-400'],
  };
  return (
    <DataGrid
      columns={[
        { header: 'Date', field: 'date', isSortable: true },
        {
          header: 'Status',
          field: 'status',
          isSortable: true,
          className: '!p-0',
          displayCell: (row) => (
            <div
              className={cn(
                'px-3 py-2 rounded-4 ',
                className[row.status as ExamenStatus][0]
              )}
            >
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    'w-2.5 h-2.5 rounded-full',
                    className[row.status as ExamenStatus][1]
                  )}
                />
                <span className=" ">{row.status}</span>
              </div>
            </div>
          ),
        },
        { header: 'Animal', field: 'animal', isSortable: true },
        { header: 'Vétérinaire', field: 'vet', isSortable: true },
        { header: 'Commentaire', field: 'comment' },
      ]}
      data={rows}
    />
  );
}
