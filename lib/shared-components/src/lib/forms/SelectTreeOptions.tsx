'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { cn } from '../utils/cn';
import Input from './Input';
import {
  TreeSelectionOption,
  TreeSelectionValue,
} from '../types/TreeOptionType';

type SelectTreeOptionsProps = {
  options: TreeSelectionOption[];
  value?: TreeSelectionValue;
  onValueChange?: (value: string, textValue: string) => void;
  onValidationChange?: (isValid: boolean, errors: string[]) => void;
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
} & React.HTMLAttributes<HTMLDivElement>;

// SVG Components for reuse
const CircleIcon = ({
  isSelected,
  isInvalid,
}: {
  isSelected: boolean;
  isInvalid?: boolean;
}) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="block"
  >
    <rect
      x="0.5"
      y="0.5"
      width="15"
      height="15"
      rx="7.5"
      stroke={isInvalid ? '#FF4242' : '#D9D9D9'}
      strokeWidth="1"
    />
    {isSelected && (
      <circle cx="8" cy="8" r="6" fill={isSelected ? '#34BBEB' : ''} />
    )}
  </svg>
);

export default function SelectTreeOptions({
  options,
  value,
  onValueChange,
  onValidationChange,
  name,
  disabled = false,
  className = '',
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedby,
  onChange: fieldOnChange,
  onBlur: fieldOnBlur,
  t,
  ...rest
}: SelectTreeOptionsProps) {
  const [selected, setSelected] = useState<TreeSelectionValue>({
    key: value?.key || '',
    textValue: value?.textValue || '',
  });

  // Debounced callback for text changes to avoid excessive calls during typing
  const debouncedOnValueChange = useMemo(() => {
    if (!onValueChange) return undefined;

    let timeoutId: NodeJS.Timeout;
    const debouncedFn = ((key: string, textValue: string) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        onValueChange(key, textValue);
      }, 300);
    }) as ((key: string, textValue: string) => void) & { cancel?: () => void };

    // Cleanup function to clear timeout
    debouncedFn.cancel = () => clearTimeout(timeoutId);

    return debouncedFn;
  }, [onValueChange]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debouncedOnValueChange) {
        debouncedOnValueChange.cancel?.();
      }
    };
  }, [debouncedOnValueChange]);

  // Validation function
  const validateSelections = useCallback(
    (currentSelections: TreeSelectionValue) => {
      const errors: string[] = [];

      options.forEach((option) => {
        const optionKey = option.key;
        const isOptionSelected = currentSelections.key === optionKey;
        const optionTextValue = currentSelections.textValue || '';

        // Check option validation
        if (
          isOptionSelected &&
          option.hasTextField &&
          (!optionTextValue || optionTextValue.trim() === '')
        ) {
          errors.push(
            `${option.label} ${
              t ? t('fields.description_required') : 'requires a description'
            }`
          );
        }
      });

      const isValid = errors.length === 0;
      return { isValid, errors };
    },
    [options, t]
  );

  // Run validation whenever selections change
  useEffect(() => {
    if (onValidationChange) {
      const { isValid, errors } = validateSelections(selected);
      onValidationChange(isValid, errors);
    }
  }, [selected, onValidationChange, validateSelections]);

  const handleOptionToggle = (optionKey: string) => {
    if (disabled) return;
    if (optionKey === selected.key) {
      return;
    }

    const newSelected = {
      key: optionKey,
      textValue: '',
    };

    // If deselecting, newSelections remains empty (no options selected)

    setSelected(newSelected);
    // Immediate call for option selection (radio button clicks)
    onValueChange?.(newSelected.key, newSelected.textValue);

    // Notify react-hook-form
    if (typeof fieldOnChange === 'function') {
      fieldOnChange({
        target: {
          name,
          type: 'radio',
          value: optionKey,
          checked: true,
        },
      } as React.ChangeEvent<HTMLInputElement>);
    }
  };

  const handleTextChange = (optionKey: string, textValue: string) => {
    if (disabled) return;

    const newSelected = {
      key: optionKey,
      textValue: textValue,
    };

    setSelected(newSelected);
    // Use debounced callback for text changes to avoid excessive calls during typing
    debouncedOnValueChange?.(newSelected.key, newSelected.textValue);
  };

  return (
    <div className={cn('', className)} {...rest}>
      {/* All options displayed as single level */}
      <div className="flex flex-col gap-2.5 ">
        {options.map((option) => {
          const optionKey = option.key;

          const isOptionSelected = selected.key === optionKey;
          const optionInputId = `${name ?? 'tree'}-${optionKey}`;
          const optionTextValue = isOptionSelected
            ? selected.textValue || ''
            : '';

          // Check if option is invalid (selected with hasTextField but no text value)
          const isOptionInvalid =
            isOptionSelected &&
            option.hasTextField &&
            (!optionTextValue || optionTextValue.trim() === '');

          return (
            <div key={option.key} className="">
              <div className="flex flex-col gap-2.5 ">
                <div className="grid grid-cols-[20px_1fr] items-start gap-2 min-w-0">
                  {/* Hidden real input for form handling */}
                  <input
                    id={optionInputId}
                    type="radio"
                    name={`${name}-options`}
                    value={optionKey}
                    checked={isOptionSelected}
                    disabled={disabled}
                    onChange={() => handleOptionToggle(optionKey)}
                    onBlur={fieldOnBlur}
                    className="sr-only absolute opacity-0 pointer-events-none"
                  />

                  {/* Custom SVG radio button */}
                  <button
                    type="button"
                    onClick={() => handleOptionToggle(optionKey)}
                    disabled={disabled}
                    className={cn(
                      'mr-2 flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-el-blue-500 focus:ring-offset-1 rounded-full',
                      disabled
                        ? 'opacity-50 cursor-not-allowed'
                        : 'cursor-pointer hover:scale-105 transition-transform'
                    )}
                  >
                    <CircleIcon
                      isSelected={isOptionSelected}
                      isInvalid={isOptionInvalid}
                    />
                  </button>

                  <label
                    htmlFor={optionInputId}
                    className={cn(
                      'text-14 font-medium cursor-pointer',
                      disabled && 'opacity-50 cursor-not-allowed'
                    )}
                  >
                    {option.label}
                  </label>
                </div>

                {/* Text field for option if it has one and is selected */}
                {isOptionSelected && option.hasTextField && (
                  <div className="ml-6">
                    <Input
                      type="text"
                      placeholder={
                        option.textFieldPlaceholder ||
                        (t
                          ? t('fields.default_text_placeholder')
                          : 'Enter details...')
                      }
                      value={optionTextValue}
                      onChange={(e) =>
                        handleTextChange(optionKey, e.target.value)
                      }
                      disabled={disabled}
                      className={cn(
                        'text-12  box-border',
                        isOptionInvalid &&
                          'border-red-500 focus:border-red-500 focus:ring-red-500'
                      )}
                    />
                    {isOptionInvalid && (
                      <p className="text-12 text-el-red-500">
                        {t
                          ? t('fields.field_required')
                          : 'This field is required'}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
