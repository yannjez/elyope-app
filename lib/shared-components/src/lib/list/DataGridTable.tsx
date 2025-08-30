'use client';

import { ReactNode } from 'react';
import { cn } from '../utils/cn';
import CarretIcon from '../icons/Carret';
import { DataGridColumn } from './DataGrid';

export type DataGridTableProps<T> = {
  columns: DataGridColumn<T>[];
  data: (T & { rowClass?: string })[];
  className?: string;
  onSort?: (field: keyof T, direction: 'asc' | 'desc') => void;
  sortField?: keyof T | null;
  sortDirection?: 'asc' | 'desc';
  blueMode?: boolean;
  rowActions?: Array<{
    name: string;
    icon: ReactNode;
    propertyKey?: keyof T;
    onClick: (value: string | undefined) => void;
    className?: string;
  }>;
};

/**
 * DataGridTable component - Desktop table view for DataGrid
 *
 * This component renders data in a traditional table format optimized for desktop screens.
 * It includes sortable columns, row actions, and customizable styling.
 */
export function DataGridTable<T extends object>({
  columns,
  data,
  className,
  onSort,
  sortField,
  sortDirection,
  blueMode = false,
  rowActions = [],
}: DataGridTableProps<T>) {
  const handleSort = (field: keyof T) => {
    const newSortDirection =
      sortField === field ? (sortDirection === 'asc' ? 'desc' : 'asc') : 'asc';
    onSort?.(field, newSortDirection);
  };

  return (
    <div className={cn('overflow-x-auto', className)}>
      <table className="w-full border-separate border-spacing-[4px]">
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
                <div className="flex items-center gap-1">
                  <span className="text-12 text-el-grey-500">{col.header}</span>
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
            {rowActions.map((_, idx) => (
              <th key={`action-h-${idx}`} className="px-2 py-1 text-left" />
            ))}
          </tr>
        </thead>
        <tbody>
          {data?.map((row, rowIdx) => (
            <tr
              key={rowIdx}
              className={cn(
                'bg-white',
                blueMode && 'bg-el-blue-200',
                row.rowClass ?? ''
              )}
            >
              {columns.map((col, colIdx) => (
                <td
                  key={colIdx}
                  className={cn('mx-2 my-1 py-2 px-3 rounded-4', col.className)}
                >
                  {col.displayCell
                    ? col.displayCell(row)
                    : String(row[col.field] ?? '')}
                </td>
              ))}
              {rowActions.map((action, actionIdx) => {
                const keyToUse = action.propertyKey ?? ('id' as keyof T);
                const actionValue = (row as T)[keyToUse];

                return (
                  <td key={`action-${actionIdx}`} className="rounded-4">
                    <div className="flex items-center justify-center">
                      <button
                        type="button"
                        aria-label={action.name}
                        className={cn(
                          'h-[28px] w-auto cursor-pointer flex items-center justify-center rounded-4 bg-white text-el-grey-300 hover:text-el-blue-500 transition-colors duration-300',
                          blueMode && 'bg-el-blue-200 text-el-blue-500',
                          action.className
                        )}
                        onClick={() =>
                          actionValue && action.onClick(String(actionValue))
                        }
                      >
                        {action.icon}
                      </button>
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DataGridTable;
