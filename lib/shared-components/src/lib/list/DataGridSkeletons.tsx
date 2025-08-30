'use client';

import { cn } from '../utils/cn';
import { DataGridColumn } from './DataGrid';

export type SkeletonRowProps = {
  columns: DataGridColumn<object>[];
  className?: string;
};

export type MobileSkeletonCardProps = {
  className?: string;
  blueMode?: boolean;
};

/**
 * Skeleton row component for loading state in table view
 */
export function SkeletonRow({ columns, className }: SkeletonRowProps) {
  return (
    <tr className="bg-white">
      <td
        colSpan={columns.length}
        className={cn('mx-2 my-1 py-2 px-3 rounded-4', className)}
      >
        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
      </td>
    </tr>
  );
}

/**
 * Mobile skeleton card for loading state in card view
 */
export function MobileSkeletonCard({
  className,
  blueMode,
}: MobileSkeletonCardProps) {
  return (
    <div
      className={cn(
        'p-4 rounded-4 bg-white mb-3',
        blueMode && 'bg-el-blue-200',
        className
      )}
    >
      {/* Primary field skeleton */}
      <div className="mb-3">
        <div className="h-5 bg-el-grey-200 rounded-4 animate-pulse w-3/4"></div>
      </div>

      {/* Secondary fields skeleton */}
      <div className="space-y-2 mb-3">
        {Array.from({ length: 3 }).map((_, idx) => (
          <div key={idx} className="flex justify-between items-center">
            <div className="h-3 bg-el-grey-200 rounded animate-pulse w-1/4"></div>
            <div className="h-3 bg-el-grey-200 rounded animate-pulse w-1/3"></div>
          </div>
        ))}
      </div>

      {/* Actions skeleton */}
      <div className="flex gap-2 justify-end pt-2 border-t border-gray-100">
        <div className="h-8 w-8 bg-el-grey-200 rounded animate-pulse"></div>
        <div className="h-8 w-8 bg-el-grey-200 rounded animate-pulse"></div>
      </div>
    </div>
  );
}
