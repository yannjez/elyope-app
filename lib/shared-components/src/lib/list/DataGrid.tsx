'use client';

import { ReactNode, useState, useMemo } from 'react';
import { cn } from '../utils/cn';
import CarretIcon from '../icons/Carret';
import NoDataIcon from '../icons/NoData';
import Pagination from './Pagination';

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
  onSort?: (field: keyof T, direction: 'asc' | 'desc') => void;
  noDataMessage?: string | ReactNode;
  isLoading?: boolean;
  loadingRows?: number;
  // Pagination props
  pagination?: {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    onPageChange: (page: number) => void;
    showPagination?: boolean;
  };
};

/**
 * DataGrid component with sorting, no data state, loading state, and pagination support
 *
 * Features:
 * - Sortable columns with visual indicators
 * - Loading state with skeleton rows
 * - Built-in no data state with cross-in-circle icon
 * - Customizable no data message
 * - Pagination with configurable page size and navigation
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
 *
 * // With custom no data content
 * <DataGrid
 *   columns={columns}
 *   data={users}
 *   noDataMessage={
 *     <div className="text-center">
 *       <p className="text-lg font-semibold mb-2">No users found</p>
 *       <p className="text-sm text-gray-500 mb-4">Try adjusting your filters</p>
 *       <Button onClick={handleReset}>Reset Filters</Button>
 *     </div>
 *   }
 * />
 * ```
 */

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

// Skeleton row component for loading state
function SkeletonRow({ columns }: { columns: DataGridColumn<any>[] }) {
  return (
    <tr className="bg-white">
      {columns.map((col, colIdx) => (
        <td
          key={colIdx}
          className={cn('mx-2 my-1 py-2 px-3 rounded-4 text-14', col.className)}
        >
          <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
        </td>
      ))}
    </tr>
  );
}

export function DataGrid<T extends object>({
  columns,
  data,
  className,
  onSort,
  noDataMessage = 'No data available',
  isLoading = false,
  loadingRows = 5,
  pagination,
}: DataGridProps<T>) {
  const [sortField, setSortField] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (field: keyof T) => {
    const newSortDirection =
      sortField === field ? (sortDirection === 'asc' ? 'desc' : 'asc') : 'asc';

    setSortDirection(newSortDirection);
    if (sortField !== field) {
      setSortField(field);
    }
    onSort?.(field, newSortDirection);
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
            {Array.from({ length: loadingRows }).map((_, rowIdx) => (
              <SkeletonRow key={rowIdx} columns={columns} />
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
        </table>

        {/* No Data State */}
        <div className="flex items-center gap-2 justify-center py-12 px-4 bg-white rounded-4 ">
          <div className="text-el-grey-300">
            <NoDataIcon className="w-8 h-8" />
          </div>
          <div className="text-center">
            {typeof noDataMessage === 'string' ? (
              <p className="text-14 text-el-grey-500 font-medium">
                {noDataMessage}
              </p>
            ) : (
              noDataMessage
            )}
          </div>
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
          {displayedData?.map((row, rowIdx) => (
            <tr key={rowIdx} className={cn(' bg-white ', row.rowClass ?? '')}>
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
