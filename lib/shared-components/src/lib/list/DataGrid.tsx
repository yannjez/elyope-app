'use client';

import { ReactNode, useState, useMemo } from 'react';
import { cn } from '../utils/cn';
import Pagination from './Pagination';
import DataGridTable from './DataGridTable';
import DataGridCard from './DataGridCard';
import DataGridNoData from './DataGridNoData';
import { SkeletonRow, MobileSkeletonCard } from './DataGridSkeletons';

export type DataGridColumn<T> = {
  header: string | ReactNode;
  field: keyof T | string; // Allow both keyof T and string for dot notation (e.g., 'breed.name_fr')
  isSortable?: boolean;
  displayCell?: (row: T) => ReactNode | string;
  className?: string;
  // Mobile-specific properties
  hiddenOnMobile?: boolean;
  mobileLabel?: string; // Custom label for mobile view
  isPrimary?: boolean; // Primary field to show prominently on mobile
};

export type DataGridProps<T> = {
  columns: DataGridColumn<T>[];
  data: (T & { rowClass?: string })[];
  className?: string;
  skeletonRowClass?: string;
  onSort?: (field: keyof T | string, direction: 'asc' | 'desc') => void;
  noDataMessage?: string | ReactNode;
  isLoading?: boolean;
  loadingRows?: number;
  // Controlled sort state
  sortField?: keyof T | string | null;
  sortDirection?: 'asc' | 'desc';
  blueMode?: boolean;
  // Mobile configuration
  mobileCardClassName?: string; // Custom className for mobile cards
  // Pagination props
  pagination?: {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    onPageChange: (page: number) => void;
    showPagination?: boolean;
  };
  /**
   * Row actions displayed at the end of each row.
   * - name: Accessible name used for aria-label
   * - icon: ReactNode rendered inside the button
   * - propertyKey: Row property to pass to handler (defaults to 'id')
   * - onClick: Handler invoked with the property value
   */
  rowActions?: Array<{
    name: string;
    icon: ReactNode;
    propertyKey?: keyof T;
    onClick: (value: string | undefined) => void;
    className?: string;
  }>;
};

/**
 * Helper function to get nested object values using dot notation
 */
function getNestedValue(obj: unknown, path: string): unknown {
  return path.split('.').reduce((current, key) => {
    return current && typeof current === 'object'
      ? (current as Record<string, unknown>)[key]
      : undefined;
  }, obj);
}

function sortData<T>(
  data: T[],
  field: keyof T | string,
  direction: 'asc' | 'desc'
) {
  return [...data].sort((a, b) => {
    const aValue =
      typeof field === 'string' ? getNestedValue(a, field) : a[field];
    const bValue =
      typeof field === 'string' ? getNestedValue(b, field) : b[field];
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
  skeletonRowClass,
  onSort,
  noDataMessage = 'No data available',
  isLoading = false,
  loadingRows = 5,
  sortField: externalSortField,
  sortDirection: externalSortDirection,
  pagination,
  rowActions = [],
  blueMode = false,
  mobileCardClassName,
}: DataGridProps<T>) {
  const [internalSortField, setInternalSortField] = useState<
    keyof T | string | null
  >(null);
  const [internalSortDirection, setInternalSortDirection] = useState<
    'asc' | 'desc'
  >('asc');

  // Use external sort state if provided, otherwise use internal state
  const sortField =
    externalSortField !== undefined ? externalSortField : internalSortField;
  const sortDirection =
    externalSortDirection !== undefined
      ? externalSortDirection
      : internalSortDirection;

  const handleSort = (field: keyof T | string, direction: 'asc' | 'desc') => {
    // Update internal state if not using external state
    if (externalSortField === undefined) {
      setInternalSortDirection(direction);
      if (sortField !== field) {
        setInternalSortField(field);
      }
    }
    onSort?.(field, direction);
  };

  let displayedData = data;
  if (sortField && !onSort) {
    displayedData = sortData(data, sortField, sortDirection);
  }

  // Calculate pagination values
  const paginationData = useMemo(() => {
    if (!pagination) return null;

    const { currentPage, pageSize, totalItems } = pagination;
    const totalPages = Math.ceil(totalItems / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, totalItems);

    return {
      totalPages,
      startIndex,
      endIndex,
      hasNextPage: currentPage < totalPages,
      hasPrevPage: currentPage > 1,
    };
  }, [pagination]);

  // Loading state
  if (isLoading) {
    return (
      <div className={cn('text-14', className)}>
        {/* Mobile loading skeleton cards - visible on mobile only */}
        <div className="md:hidden space-y-3">
          {Array.from({ length: loadingRows }).map((_, rowIdx) => (
            <MobileSkeletonCard
              key={rowIdx}
              className={mobileCardClassName}
              blueMode={blueMode}
            />
          ))}
        </div>

        {/* Desktop loading table - visible on desktop only */}
        <div className="hidden md:block overflow-x-auto table-fixed">
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
                  >
                    <div className="flex items-center gap-1">
                      <span className="text-12 text-el-grey-500">
                        {col.header}
                      </span>
                    </div>
                  </th>
                ))}
                {rowActions.map((_, idx) => (
                  <th
                    key={`action-h-${idx}`}
                    className="px-2 py-1 text-left w-fit"
                  />
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: loadingRows }).map((_, rowIdx) => (
                <SkeletonRow
                  key={rowIdx}
                  columns={
                    [
                      ...columns,
                      ...rowActions.map(() => ({
                        header: '',
                        field: '' as unknown as keyof T,
                      })),
                    ] as DataGridColumn<object>[]
                  }
                  className={skeletonRowClass}
                />
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination in loading state */}
        {pagination &&
          paginationData &&
          pagination.showPagination !== false && (
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={paginationData.totalPages}
              onPageChange={pagination.onPageChange}
              className="mt-4"
            />
          )}
      </div>
    );
  }

  // No data state
  if (!displayedData || displayedData.length === 0) {
    return (
      <div className={cn('text-14', className)}>
        {/* Desktop table header - visible on desktop only */}
        <div className="hidden md:block overflow-x-auto">
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
                  >
                    <div className="flex items-center gap-1">
                      <span className="text-12 text-el-grey-500">
                        {col.header}
                      </span>
                    </div>
                  </th>
                ))}
                {rowActions.map((_, idx) => (
                  <th
                    key={`action-h-empty-${idx}`}
                    className="px-2 py-1 text-left"
                  />
                ))}
              </tr>
            </thead>
          </table>
        </div>

        {/* No data message for mobile */}
        <div className="md:hidden">
          <DataGridNoData
            message={noDataMessage}
            isMobile={true}
            blueMode={blueMode}
          />
        </div>

        {/* No data message for desktop */}
        <div className="hidden md:block">
          <DataGridNoData
            message={noDataMessage}
            isMobile={false}
            blueMode={blueMode}
          />
        </div>

        {/* Pagination in no data state */}
        {pagination &&
          paginationData &&
          pagination.showPagination !== false && (
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={paginationData.totalPages}
              onPageChange={pagination.onPageChange}
              className="mt-4"
            />
          )}
      </div>
    );
  }

  // Main data rendering - responsive layout
  return (
    <div className={cn('text-14', className)}>
      {/* Mobile card view - visible on mobile only */}
      <div className="md:hidden">
        <DataGridCard
          columns={columns}
          data={displayedData}
          cardClassName={mobileCardClassName}
          onSort={handleSort}
          sortField={sortField}
          sortDirection={sortDirection}
          blueMode={blueMode}
          rowActions={rowActions}
        />
      </div>

      {/* Desktop table view - visible on desktop only */}
      <div className="hidden md:block">
        <DataGridTable
          columns={columns}
          data={displayedData}
          onSort={handleSort}
          sortField={sortField}
          sortDirection={sortDirection}
          blueMode={blueMode}
          rowActions={rowActions}
        />
      </div>

      {/* Pagination */}
      {pagination && paginationData && pagination.showPagination !== false && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={paginationData.totalPages}
          onPageChange={pagination.onPageChange}
          className="mt-4"
        />
      )}
    </div>
  );
}

export default DataGrid;
