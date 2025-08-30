'use client';

import { ReactNode } from 'react';
import { cn } from '../utils/cn';
import CarretIcon from '../icons/Carret';
import { DataGridColumn } from './DataGrid';

export type DataGridCardProps<T> = {
  columns: DataGridColumn<T>[];
  data: (T & { rowClass?: string })[];
  className?: string;
  cardClassName?: string;
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

// Single mobile card component
function MobileCard<T extends object>({
  row,
  columns,
  rowActions,
  blueMode,
  className,
}: {
  row: T & { rowClass?: string };
  columns: DataGridColumn<T>[];
  rowActions: Array<{
    name: string;
    icon: ReactNode;
    propertyKey?: keyof T;
    onClick: (value: string | undefined) => void;
    className?: string;
  }>;
  blueMode?: boolean;
  className?: string;
}) {
  // Get primary field (first column marked as primary, or first column)
  const primaryColumn = columns.find((col) => col.isPrimary) || columns[0];

  // Get visible columns (excluding hidden ones and primary)
  const visibleColumns = columns.filter(
    (col) => !col.hiddenOnMobile && col !== primaryColumn
  );

  return (
    <div
      className={cn(
        'p-4 rounded-4 bg-white mb-3',
        blueMode && 'bg-el-blue-200',
        row.rowClass,
        className
      )}
    >
      {/* Primary field - displayed prominently */}
      {primaryColumn && (
        <div className="mb-3">
          <div className="font-semibold text-16 text-el-grey-700">
            {primaryColumn.displayCell
              ? primaryColumn.displayCell(row)
              : String(row[primaryColumn.field] ?? '')}
            {blueMode ? 'true' : 'false'} {row.rowClass} {className}
          </div>
        </div>
      )}

      {/* Other fields - displayed as key-value pairs */}
      {visibleColumns.length > 0 && (
        <div className="space-y-2 mb-3">
          {visibleColumns.map((col, idx) => {
            const label =
              col.mobileLabel ||
              (typeof col.header === 'string'
                ? col.header
                : `Field ${idx + 1}`);
            const value = col.displayCell
              ? col.displayCell(row)
              : String(row[col.field] ?? '');

            if (!value || value === '') return null;

            return (
              <div key={idx} className="flex justify-between items-start">
                <span className="text-12 text-el-grey-500 font-medium min-w-0 flex-1">
                  {label}:
                </span>
                <span className="text-14 text-el-grey-700 ml-2 text-right">
                  {value}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Row actions */}
      {rowActions.length > 0 && (
        <div className="flex gap-2 justify-end pt-2 border-t border-gray-100">
          {rowActions.map((action, actionIdx) => {
            const keyToUse = action.propertyKey ?? ('id' as keyof T);
            const actionValue = (row as T)[keyToUse];

            return (
              <button
                key={actionIdx}
                type="button"
                aria-label={action.name}
                className={cn(
                  'h-6 w-auto cursor-pointer flex items-center justify-center rounded-4 text-el-grey-400 hover:text-el-blue-500 hover:bg-el-blue-50 transition-colors duration-300',
                  blueMode &&
                    'bg-el-blue-300 text-el-blue-600 hover:bg-el-blue-400',
                  action.className
                )}
                onClick={() =>
                  actionValue && action.onClick(String(actionValue))
                }
              >
                {action.icon}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/**
 * DataGridCard component - Mobile card view for DataGrid
 *
 * This component renders data in a card format optimized for mobile screens.
 * It includes a sorting header, mobile-friendly cards, and responsive design.
 */
export function DataGridCard<T extends object>({
  columns,
  data,
  className,
  cardClassName,
  onSort,
  sortField,
  sortDirection,
  blueMode = false,
  rowActions = [],
}: DataGridCardProps<T>) {
  const handleSort = (field: keyof T) => {
    const newSortDirection =
      sortField === field ? (sortDirection === 'asc' ? 'desc' : 'asc') : 'asc';
    onSort?.(field, newSortDirection);
  };

  return (
    <div className={cn('text-14', className)}>
      {/* Mobile sorting header */}
      {columns.some((col) => col.isSortable) && (
        <div className="mb-4 p-3 bg-el-grey-100 rounded-4 ">
          <div className="text-12 text-el-grey-500 font-medium mb-2">
            Sort by:
          </div>
          <div className="flex flex-wrap gap-2">
            {columns
              .filter((col) => col.isSortable)
              .map((col, idx) => {
                const isActive = sortField === col.field;
                const label =
                  typeof col.header === 'string'
                    ? col.header
                    : `Field ${idx + 1}`;

                return (
                  <button
                    key={idx}
                    onClick={() => handleSort(col.field)}
                    className={cn(
                      'flex items-center gap-1 px-3 py-1 rounded-4 text-12 transition-colors duration-200',
                      isActive
                        ? 'bg-el-blue-500 text-white'
                        : 'bg-white text-el-grey-600 border border-gray-200 hover:bg-gray-50'
                    )}
                  >
                    <span>{label}</span>
                    {isActive && (
                      <CarretIcon
                        className={cn(
                          'w-3 h-3 transition-transform duration-300',
                          sortDirection === 'desc' ? 'rotate-180' : ''
                        )}
                      />
                    )}
                  </button>
                );
              })}
          </div>
        </div>
      )}

      {/* Mobile cards */}
      <div className="space-y-3">
        {data?.map((row, rowIdx) => (
          <MobileCard
            key={rowIdx}
            row={row}
            columns={columns}
            rowActions={rowActions}
            blueMode={blueMode}
            className={cardClassName}
          />
        ))}
      </div>
    </div>
  );
}

export default DataGridCard;
