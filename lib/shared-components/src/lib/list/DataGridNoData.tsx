'use client';

import { ReactNode } from 'react';
import { cn } from '../utils/cn';
import NoDataIcon from '../icons/NoData';

export type DataGridNoDataProps = {
  message?: string | ReactNode;
  isMobile?: boolean;
  blueMode?: boolean;
  className?: string;
};

/**
 * NoData component for DataGrid - handles both mobile and desktop views
 */
export function DataGridNoData({
  message = 'No data available',
  isMobile = false,
  blueMode = false,
  className,
}: DataGridNoDataProps) {
  if (isMobile) {
    return (
      <div
        className={cn(
          'flex flex-col items-center gap-4 justify-center py-12 px-4 bg-white rounded-4',
          blueMode ? 'bg-el-blue-200 border-el-blue-300' : 'bg-white',
          className
        )}
      >
        <div className="text-el-grey-300">
          <NoDataIcon className="w-12 h-12" />
        </div>
        <div className="text-center">
          {typeof message === 'string' ? (
            <p className="text-el-grey-500 font-medium text-16">{message}</p>
          ) : (
            message
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex items-center gap-2 justify-center py-12 px-4 bg-white rounded-4',
        blueMode ? 'bg-el-blue-200' : 'bg-white',
        className
      )}
    >
      <div className="text-el-grey-300">
        <NoDataIcon className="w-8 h-8" />
      </div>
      <div className="text-center">
        {typeof message === 'string' ? (
          <p className="text-el-grey-500 font-medium">{message}</p>
        ) : (
          message
        )}
      </div>
    </div>
  );
}

export default DataGridNoData;
