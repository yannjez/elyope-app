// ...StatusBadge and rows as above

import { DataGrid, type ExamenStatus } from '@app-test2/shared-components';
import { cn } from '../../../../../../lib/shared-components/src/lib/utils/cn';

// Example status badge component
const StatusBadge = ({ status }: { status: ExamenStatus }) => {
  const className: Record<ExamenStatus, string> = {
    pending: 'bg-status-pending-light text-status-pending',
    processing: 'bg-status-processing-light text-status-processing',
    completed: 'bg-status-completed-light text-status-completed',
    archived: 'bg-status-archived-light text-status-archived',
  };
  return (
    <span
      className={
        className[status] && 'bg-status-processing-light text-status-processing'
      }
    >
      {status}
    </span>
  );
};

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
    pending: ['bg-status-pending-light ', 'bg-status-pending'],
    processing: ['bg-status-processing-light', 'bg-status-processing'],
    completed: ['bg-status-completed-light ', 'bg-status-completed'],
    archived: ['bg-status-archived-light ', 'bg-status-archived'],
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
