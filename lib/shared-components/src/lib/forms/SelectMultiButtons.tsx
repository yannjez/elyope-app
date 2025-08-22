'use client';

import { useEffect, useMemo, useState } from 'react';
import { Option } from '../types/Base';
import { cn } from '../utils/cn';

type SelectMultiButtonsProps = {
  options: Option[];
  value?: string[];
  onValuesChange?: (value: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  name?: string;
  'aria-label'?: string;
  'aria-describedby'?: string;
  maxSelections?: number;
  minSelections?: number;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
} & React.HTMLAttributes<HTMLDivElement> & {
    // react-hook-form register props forwarded by FormField
    onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  };

export default function SelectMultiButtons({
  options,
  value,
  onValuesChange,
  name,
  placeholder = 'Select options',
  disabled = false,
  className = '',
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedby,
  maxSelections,
  minSelections = 0,
  onChange: fieldOnChange,
  onBlur: fieldOnBlur,
  ...rest
}: SelectMultiButtonsProps) {
  const [innerValues, setInnerValues] = useState<string[]>(value ?? []);

  // Keep internal state in sync when a controlled value is provided
  useEffect(() => {
    if (Array.isArray(value)) {
      setInnerValues(value);
    }
  }, [value]);

  const currentValues = useMemo(() => innerValues, [innerValues]);

  const isOptionSelected = (optionValue: string) =>
    currentValues.includes(optionValue);

  const isOptionDisabled = (optionValue: string) => {
    if (disabled) return true;
    if (
      maxSelections &&
      currentValues.length >= maxSelections &&
      !isOptionSelected(optionValue)
    ) {
      return true;
    }
    return false;
  };

  const applySelectionChange = (
    newValues: string[],
    toggledValue: string,
    checked: boolean
  ) => {
    // External consumer callback
    onValuesChange?.(newValues);
    // RHF register onChange expects a checkbox-like event
    if (typeof fieldOnChange === 'function') {
      fieldOnChange({
        target: { name, type: 'checkbox', value: toggledValue, checked },
      });
    }
  };

  const handleOptionToggle = (optionValue: string) => {
    if (disabled) return;
    const alreadySelected = currentValues.includes(optionValue);
    const tentative = alreadySelected
      ? currentValues.filter((v) => v !== optionValue)
      : [...currentValues, optionValue];
    if (maxSelections && tentative.length > maxSelections) return;
    setInnerValues(tentative);
    applySelectionChange(tentative, optionValue, !alreadySelected);
  };

  const getSelectionText = () => {
    if (currentValues.length === 0) return placeholder;
    if (currentValues.length === 1) {
      const selectedOption = options.find((o) => o.value === currentValues[0]);
      return selectedOption?.label || currentValues[0];
    }
    return `${currentValues.length} selected`;
  };

  return (
    <div className={cn('flex flex-col gap-2', className)} {...rest}>
      {/* Selection Summary – align with Select */}
      <div
        className={cn(
          ' hidden relative w-full border border-el-grey-400 rounded-4',
          'px-3 py-2 bg-el-grey-100 text-el-grey-800 text-14',
          disabled && 'opacity-50'
        )}
        aria-label={ariaLabel || 'Multi-select options'}
        aria-describedby={ariaDescribedby}
      >
        <span className="text-14">{getSelectionText()}</span>
        {maxSelections && (
          <span className="text-12 text-el-grey-600 ml-2">
            ({currentValues.length}/{maxSelections})
          </span>
        )}
      </div>

      {/* Hidden checkbox inputs (for RHF array registration) and visible labels */}
      <div
        className="flex flex-wrap gap-2"
        role="group"
        aria-label="Available options"
      >
        {options.map((option) => {
          const selected = isOptionSelected(option.value);
          const optionDisabled = isOptionDisabled(option.value);
          const inputId = `${name ?? 'multi'}-${option.value}`;

          return (
            <div key={option.value} className="inline-flex items-center">
              {/* Hidden checkbox to integrate with RHF */}
              <input
                id={inputId}
                type="checkbox"
                name={name}
                value={option.value}
                checked={selected}
                disabled={optionDisabled}
                onChange={() => handleOptionToggle(option.value)}
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
                      ? 'bg-el-grey-100 text-el-blue-500  '
                      : 'bg-el-grey-100 text-el-grey-800 border-el-grey-400 hover:border-el-blue-500',
                    optionDisabled && 'opacity-50 cursor-not-allowed'
                  ) + ' text-12'
                }
                aria-disabled={optionDisabled}
              >
                {option.label}
              </label>
            </div>
          );
        })}
      </div>

      {/* Validation Messages */}
      {minSelections > 0 && currentValues.length < minSelections && (
        <div className="text-12 text-el-red-500">
          Please select at least {minSelections} option
          {minSelections > 1 ? 's' : ''}
        </div>
      )}

      {maxSelections && currentValues.length > maxSelections && (
        <div className="text-12 text-el-red-500">
          Maximum {maxSelections} selection{maxSelections > 1 ? 's' : ''}{' '}
          allowed
        </div>
      )}
    </div>
  );
}
