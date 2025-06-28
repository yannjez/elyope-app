'use client';

import { ReactNode, useState } from 'react';
import { cn } from '../utils/cn';
import CarretIcon from '../icons/Carret';

export type DataGridColumn<T> = {
  header: string | ReactNode;
  field: keyof T;
  isSortable?: boolean;
  displayCell?: (row: T) => ReactNode | string;
  className?: string;
};

export type DataGridProps<T> = {
  columns: DataGridColumn<T>[];
  data: (T & { rowClass?: string })[];
  className?: string;
};

function sortData<T>(data: T[], field: keyof T, direction: 'asc' | 'desc') {
  return [...data].sort((a, b) => {
    const aValue = a[field];
    const bValue = b[field];
    if (aValue == null) return 1;
    if (bValue == null) return -1;
    if (aValue === bValue) return 0;
    if (direction === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });
}

export function DataGrid<T extends object>({
  columns,
  data,
  className,
}: DataGridProps<T>) {
  const [sortField, setSortField] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (field: keyof T) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  let displayedData = data;
  if (sortField) {
    displayedData = sortData(data, sortField, sortDirection);
  }

  return (
    <div className={cn('overflow-x-auto max-w-[1080px]', className)}>
      <table className="w-full border-separate">
        <thead>
          <tr>
            {columns.map((col, idx) => (
              <th
                key={idx}
                className={cn(
                  'text-left px-2 py-1',
                  col.isSortable ? 'cursor-pointer' : ''
                )}
                onClick={
                  col.isSortable ? () => handleSort(col.field) : undefined
                }
              >
                <div className=" flex items-center gap-1">
                  <span className=" text-12 text-el-grey-500">
                    {col.header}
                  </span>
                  {col.isSortable && (
                    <span className="ml-1 text-el-grey-300">
                      <CarretIcon
                        className={cn(
                          'transition-transform duration-300',
                          sortField === col.field
                            ? sortDirection === 'desc'
                              ? 'rotate-180 text-el-grey-500'
                              : 'text-el-grey-500'
                            : 'opacity-70'
                        )}
                      />
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {displayedData.map((row, rowIdx) => (
            <tr
              key={rowIdx}
              className={cn(' bg-white ', row.rowClass ?? '')}
            >
              {columns.map((col, colIdx) => (
                <td
                  key={colIdx}
                  className={cn(
                    'mx-2 my-1 py-2 px-3 rounded-4 text-14',
                    col.className
                  )}
                >
                  {col.displayCell
                    ? col.displayCell(row)
                    : String(row[col.field] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DataGrid;
