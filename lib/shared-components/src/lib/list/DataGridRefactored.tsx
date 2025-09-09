'use client';

import { ReactNode, useState, useMemo, useEffect } from 'react';
import { cn } from '../utils/cn';
import Pagination from './Pagination';
import DataGridTable from './DataGridTable';
import DataGridCard from './DataGridCard';
import DataGridNoData from './DataGridNoData';
import { SkeletonRow, MobileSkeletonCard } from './DataGridSkeletons';

export type DataGridColumn<T> = {
  header: string | ReactNode;
  field: keyof T;
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
  mobileBreakpoint?: number; // Breakpoint in pixels (default: 768)
  forceMobileView?: boolean; // Force mobile view regardless of screen size
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
 * DataGrid component with sorting, no data state, loading state, pagination support, and responsive mobile view
 *
 * Features:
 * - Sortable columns with visual indicators
 * - Loading state with skeleton rows
 * - Built-in no data state with cross-in-circle icon
 * - Customizable no data message
 * - Pagination with configurable page size and navigation
 * - Responsive design with mobile card layout
 * - Configurable mobile breakpoint
 * - Mobile-specific column configuration
 *
 * @example
 * ```tsx
 * // Basic usage
 * <DataGrid
 *   columns={columns}
 *   data={users}
 *   onSort={handleSort}
 * />
 *
 * // With mobile configuration
 * <DataGrid
 *   columns={[
 *     { header: 'Name', field: 'name', isPrimary: true, isSortable: true },
 *     { header: 'Email', field: 'email', mobileLabel: 'Email Address' },
 *     { header: 'Created', field: 'createdAt', hiddenOnMobile: true },
 *   ]}
 *   data={users}
 *   mobileBreakpoint={768}
 *   mobileCardClassName="shadow-sm"
 * />
 *
 * // Force mobile view
 * <DataGrid
 *   columns={columns}
 *   data={users}
 *   forceMobileView={true}
 * />
 *
 * // With loading state
 * <DataGrid
 *   columns={columns}
 *   data={users}
 *   isLoading={true}
 *   loadingRows={5}
 * />
 *
 * // With pagination
 * <DataGrid
 *   columns={columns}
 *   data={currentPageData}
 *   onSort={handleSort}
 *   pagination={{
 *     currentPage: 1,
 *     pageSize: 10,
 *     totalItems: 100,
 *     onPageChange: handlePageChange,
 *     showPagination: true,
 *   }}
 * />
 *
 * // With custom no data message
 * <DataGrid
 *   columns={columns}
 *   data={users}
 *   noDataMessage="No users found"
 * />
 * ```
 */

function sortData<T>(
  data: T[],
  field: keyof T | string,
  direction: 'asc' | 'desc'
) {
  return [...data].sort((a, b) => {
    const aValue = (a as T)[field as keyof T];
    const bValue = (b as T)[field as keyof T];
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

// Hook to detect mobile view
function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    // Check on mount
    checkIsMobile();

    // Add event listener
    window.addEventListener('resize', checkIsMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkIsMobile);
  }, [breakpoint]);

  return isMobile;
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
  mobileBreakpoint = 768,
  forceMobileView = false,
  mobileCardClassName,
}: DataGridProps<T>) {
  const [internalSortField, setInternalSortField] = useState<
    keyof T | string | null
  >(null);
  const [internalSortDirection, setInternalSortDirection] = useState<
    'asc' | 'desc'
  >('asc');

  // Mobile detection
  const isMobileScreen = useIsMobile(mobileBreakpoint);
  const isMobileView = forceMobileView || isMobileScreen;

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
    if (isMobileView) {
      return (
        <div className={cn('text-14', className)}>
          {/* Mobile loading skeleton cards */}
          <div className="space-y-3">
            {Array.from({ length: loadingRows }).map((_, rowIdx) => (
              <MobileSkeletonCard
                key={rowIdx}
                className={mobileCardClassName}
                blueMode={blueMode}
              />
            ))}
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

    return (
      <div className={cn('overflow-x-auto table-fixed text-14', className)}>
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
      <div
        className={cn(isMobileView ? 'text-14' : 'overflow-x-auto', className)}
      >
        {!isMobileView && (
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
        )}

        <DataGridNoData
          message={noDataMessage}
          isMobile={isMobileView}
          blueMode={blueMode}
        />

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

  // Main data rendering
  if (isMobileView) {
    return (
      <div className={cn('text-14', className)}>
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

        {/* Pagination */}
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

  // Desktop table view
  return (
    <div className={cn('text-14', className)}>
      <DataGridTable
        columns={columns}
        data={displayedData}
        onSort={handleSort}
        sortField={sortField}
        sortDirection={sortDirection}
        blueMode={blueMode}
        rowActions={rowActions}
      />

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
