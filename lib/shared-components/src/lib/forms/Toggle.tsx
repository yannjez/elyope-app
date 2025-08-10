import { cn } from '../utils/cn';
import React from 'react';

type ToggleProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  checkedLabel?: string;
  uncheckedLabel?: string;
};

export default function Toggle({
  className,
  checkedLabel,
  uncheckedLabel,
  ...props
}: ToggleProps) {
  return (
    <label
      className={cn('inline-flex items-center gap-2 cursor-pointer', className)}
    >
      {uncheckedLabel && (
        <span className="text-12 text-el-grey-500 select-none">
          {uncheckedLabel}
        </span>
      )}
      <input type="checkbox" className="peer sr-only" {...props} />
      <span
        className={cn(
          'relative inline-block w-8 h-4 rounded-[6px] bg-el-grey-300 transition-colors peer-checked:bg-el-blue-500',
          "after:content-[''] after:absolute after:top-[2px] after:left-1 after:h-3 after:w-3 after:rounded-[5px] after:bg-white after:shadow after:transition-transform peer-checked:after:translate-x-3"
        )}
      />
      {checkedLabel && (
        <span className="text-12 text-el-grey-500 select-none">
          {checkedLabel}
        </span>
      )}
    </label>
  );
}
