'use client';

import { useState } from 'react';
import { Option } from '../types/Base';
import { cn } from '../utils/cn';

type SelectMultiButtonsProps = {
  options: Option[];
  value: string[];
  onChange?: (value: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  name: string;
  'aria-label'?: string;
  'aria-describedby'?: string;
  maxSelections?: number;
  minSelections?: number;
};

export default function SelectMultiButtons({
  options,
  value,
  onChange,
  name,
  placeholder = 'Select options',
  disabled = false,
  className = '',
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedby,
  maxSelections,
  minSelections = 0,
  ...props
}: SelectMultiButtonsProps) {
  const [innerValues, setInnerValues] = useState<string[]>(value);

  const handleOptionToggle = (optionValue: string) => {
    if (disabled) return;

    const newValue = value.includes(optionValue)
      ? value.filter((v) => v !== optionValue)
      : [...value, optionValue];

    // Check max selections limit
    if (maxSelections && newValue.length > maxSelections) {
      return;
    }
    setInnerValues(newValue);
    onChange?.(newValue);
  };

  const isOptionSelected = (optionValue: string) => {
    return innerValues.includes(optionValue);
  };

  const isOptionDisabled = (optionValue: string) => {
    if (disabled) return true;

    // If max selections reached and option is not selected, disable it
    if (
      maxSelections &&
      value.length >= maxSelections &&
      !isOptionSelected(optionValue)
    ) {
      return true;
    }

    return false;
  };

  const getSelectionText = () => {
    if (value.length === 0) {
      return placeholder;
    }

    if (value.length === 1) {
      const selectedOption = options.find(
        (option) => option.value === value[0]
      );
      return selectedOption?.label || value[0];
    }

    return `${value.length} selected`;
  };

  return (
    <div className={cn('flex flex-col gap-2', className)} {...props}>
      {/* Selection Summary */}
      <div
        className={cn(
          'px-3 py-2 border border-el-grey-400 rounded-4',
          'bg-el-grey-100 text-el-grey-800',
          disabled && 'opacity-50'
        )}
        aria-label={ariaLabel || 'Multi-select options'}
        aria-describedby={ariaDescribedby}
      >
        <span className="text-14">{getSelectionText()}</span>
        {maxSelections && (
          <span className="text-12 text-el-grey-600 ml-2">
            ({value.length}/{maxSelections})
          </span>
        )}
      </div>

      {/* Option Buttons */}
      <div
        className="flex flex-wrap gap-2"
        role="group"
        aria-label="Available options"
      >
        {options.map((option) => {
          const selected = isOptionSelected(option.value);
          const optionDisabled = isOptionDisabled(option.value);

          return (
            <button
              key={option.value}
              role="checkbox"
              name={`${name}-${option.value}`}
              type="button"
              onClick={() => handleOptionToggle(option.value)}
              disabled={optionDisabled}
              className={cn(
                'px-3 py-2 rounded-4 text-14 font-medium transition-all duration-200',
                'border border-el-grey-400',
                'focus:outline-none focus:ring-2 focus:ring-el-grey-600 focus:ring-offset-1',
                '[aria-pressed="true"]:bg-el-primary',
                '[aria-pressed="true"]:text-white',
                '[aria-pressed="true"]:border-el-primary',

                optionDisabled && 'opacity-50 cursor-not-allowed',
                !optionDisabled && !selected && 'hover:border-el-grey-600'
              )}
              aria-pressed={selected ? 'true' : 'false'}
              aria-disabled={optionDisabled}
            >
              {option.label} {selected ? '✅' : '❌'}
            </button>
          );
        })}
      </div>

      {/* Validation Messages */}
      {minSelections > 0 && value.length < minSelections && (
        <div className="text-12 text-red-600">
          Please select at least {minSelections} option
          {minSelections > 1 ? 's' : ''}
        </div>
      )}

      {maxSelections && value.length >= maxSelections && (
        <div className="text-12 text-el-grey-600">
          Maximum {maxSelections} selection{maxSelections > 1 ? 's' : ''}{' '}
          allowed
        </div>
      )}
    </div>
  );
}
