import React from 'react';
import { cn } from '../utils/cn';
import CarretLeftIcon from '../icons/CarretLeft';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  maxVisiblePages?: number;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
  maxVisiblePages = 5,
}: PaginationProps) {
  const getVisiblePages = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      // Add ellipsis after first page if needed
      if (start > 2) {
        pages.push('...');
      }

      // Add pages around current page
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      // Add ellipsis before last page if needed
      if (end < totalPages - 1) {
        pages.push('...');
      }

      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const visiblePages = getVisiblePages();

  const handlePageClick = (page: number | string) => {
    if (typeof page === 'number') {
      onPageChange(page);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className={cn('flex  gap-1', className)}>
      {/* Previous button */}
      <button
        onClick={handlePrevious}
        disabled={currentPage <= 1}
        className={cn(
          'flex items-center justify-center w-8 h-8  rounded-4  cursor-pointer  transition-colors',
          currentPage <= 1
            ? 'bg-el-grey-100  text-el-grey-400'
            : 'bg-white  text-el-grey-500'
        )}
        aria-label="Previous page"
      >
        <CarretLeftIcon className="w-4 h-4" />
      </button>

      {/* Page numbers */}
      {visiblePages.map((page, index) => (
        <React.Fragment key={index}>
          {typeof page === 'number' ? (
            <button
              onClick={() => handlePageClick(page)}
              className={cn(
                'flex items-center justify-center w-8 h-8 rounded-4  cursor-pointer transition-colors',
                currentPage === page
                  ? 'bg-el-grey-100  text-el-grey-400'
                  : 'bg-white  text-el-grey-500'
              )}
              aria-label={`Page ${page}`}
              aria-current={currentPage === page ? 'page' : undefined}
            >
              {page}
            </button>
          ) : (
            <span className="flex items-center justify-center w-8 h-8 text-grey-400">
              {page}
            </span>
          )}
        </React.Fragment>
      ))}

      {/* Next button */}
      <button
        onClick={handleNext}
        disabled={currentPage >= totalPages}
        className={cn(
          'flex items-center justify-center w-8 h-8 rounded-4 cursor-pointer transition-colors',
          currentPage >= totalPages
            ? 'bg-el-grey-100  text-el-grey-400'
            : 'bg-white  text-el-grey-500'
        )}
        aria-label="Next page"
      >
        <CarretLeftIcon className="w-4 h-4  rotate-180" />
      </button>
    </div>
  );
}

export default Pagination;
