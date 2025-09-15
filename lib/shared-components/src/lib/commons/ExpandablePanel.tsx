'use client';

import { useState } from 'react';
import { cn } from '../utils/cn';
import ExpandableMarkerIcon from '../icons/ExpandableMarker';

type ExpandablePanelProps = {
  title: React.ReactNode | string;
  children: React.ReactNode;
  className?: string;
  defaultExpanded?: boolean;
};

export default function ExpandablePanel({
  title,
  children,
  className,
  defaultExpanded = false,
}: ExpandablePanelProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      className={cn('bg-white rounded-4 p-3 cursor-pointer', className)}
      onClick={toggleExpanded}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleExpanded();
        }
      }}
      aria-expanded={isExpanded}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          {typeof title === 'string' ? (
            <span className="text-16 font-semibold text-el-grey-800">
              {title}
            </span>
          ) : (
            title
          )}
        </div>
        <div
          className={cn(
            'ml-2 transform transition-transform duration-200 text-el-grey-600',
            {
              'rotate-180': isExpanded,
            }
          )}
        >
          <ExpandableMarkerIcon />
        </div>
      </div>

      {isExpanded && (
        <div className="mt-3 animate-in slide-in-from-top-1 duration-200">
          {children}
        </div>
      )}
    </div>
  );
}
