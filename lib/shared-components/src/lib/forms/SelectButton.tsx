'use client';

import { useEffect, useMemo, useState } from 'react';
import { Option } from '../types/Base';
import { cn } from '../utils/cn';

type SelectButtonProps = {
  options: Option[];
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  name?: string;
  'aria-label'?: string;
  'aria-describedby'?: string;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  // Translation function for validation messages
  t?: (
    key: string,
    options?: { count?: number; plural?: string; plural_verb?: string }
  ) => string;
} & React.HTMLAttributes<HTMLDivElement> & {
    // react-hook-form register props forwarded by FormField
    onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  };

export default function SelectButton({
  options,
  value,
  onValueChange,
  name,
  placeholder = 'Select option',
  disabled = false,
  className = '',
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedby,
  onChange: fieldOnChange,
  onBlur: fieldOnBlur,
  t,
  ...rest
}: SelectButtonProps) {
  const [innerValue, setInnerValue] = useState<string>(value ?? '');

  // Keep internal state in sync when a controlled value is provided
  useEffect(() => {
    if (typeof value === 'string') {
      setInnerValue(value);
    }
  }, [value]);

  const currentValue = useMemo(() => innerValue, [innerValue]);

  const isOptionSelected = (optionValue: string) =>
    currentValue === optionValue;

  const applySelectionChange = (newValue: string, checked: boolean) => {
    // External consumer callback
    onValueChange?.(newValue);
    // RHF register onChange expects a radio-like event
    if (typeof fieldOnChange === 'function') {
      fieldOnChange({
        target: { name, type: 'radio', value: newValue, checked },
      } as React.ChangeEvent<HTMLInputElement>);
    }
  };

  const handleOptionSelect = (optionValue: string) => {
    if (disabled) return;
    setInnerValue(optionValue);
    applySelectionChange(optionValue, true);
  };

  const getSelectionText = () => {
    if (!currentValue) return placeholder;
    const selectedOption = options.find((o) => o.value === currentValue);
    return selectedOption?.label || currentValue;
  };

  return (
    <div className={cn('flex flex-col gap-2', className)} {...rest}>
      {/* Selection Summary – align with Select */}
      <div
        className={cn(
          'hidden relative w-full rounded-4',
          'px-3 py-2 bg-el-grey-100 text-el-grey-800 text-14',
          disabled && 'opacity-50'
        )}
        aria-label={ariaLabel || 'Single-select options'}
        aria-describedby={ariaDescribedby}
      >
        <span className="text-14">{getSelectionText()}</span>
      </div>

      {/* Hidden radio inputs (for RHF registration) and visible labels */}
      <div
        className="flex flex-wrap gap-2"
        role="radiogroup"
        aria-label="Available options"
      >
        {options.map((option) => {
          const selected = isOptionSelected(option.value);
          const inputId = `${name ?? 'single'}-${option.value}`;

          return (
            <div key={option.value} className="inline-flex items-center">
              {/* Hidden radio to integrate with RHF */}
              <input
                id={inputId}
                type="radio"
                name={name}
                value={option.value}
                checked={selected}
                disabled={disabled}
                onChange={() => handleOptionSelect(option.value)}
                onBlur={fieldOnBlur}
                className="-p-sr-only hidden"
              />

              {/* Styled label acts as the toggle button */}
              <label
                htmlFor={inputId}
                className={
                  cn(
                    'border cursor-pointer select-none text-12 px-3 py-1.5 rounded-4 font-normal transition-all duration-200',
                    selected
                      ? 'bg-el-grey-100 text-el-blue-500'
                      : 'bg-el-grey-100 text-el-grey-800 border-el-grey-400 hover:border-el-blue-500',
                    disabled && 'opacity-50 cursor-not-allowed'
                  ) + ' text-12'
                }
                aria-disabled={disabled}
              >
                {option.label}
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
}
