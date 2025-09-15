'use client';

import { useEffect, useState, useCallback } from 'react';
import { cn } from '../utils/cn';
import Input from './Input';
import {
  TreeSelectionOption,
  TreeSelectionValue,
} from '../types/TreeOptionType';

type SelectMultiTreeOptionsProps = {
  data: TreeSelectionOption[];
  value?: Record<string, TreeSelectionValue>;
  onValueChange?: (value: Record<string, TreeSelectionValue>) => void;
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
  // Behavior for level 1 categories: "single" allows only one category to be selected, "multi" allows multiple
  behavior?: 'single' | 'multi';
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

export default function SelectMultiTreeOptions({
  data,
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
  behavior = 'multi',
  ...rest
}: SelectMultiTreeOptionsProps) {
  const [selections, setSelections] = useState<
    Record<string, TreeSelectionValue>
  >(value || {});

  // Keep internal state in sync when controlled value changes
  useEffect(() => {
    if (value) {
      setSelections(value);
    }
  }, [value]);

  // Validation function
  const validateSelections = useCallback(
    (currentSelections: Record<string, TreeSelectionValue>) => {
      const errors: string[] = [];

      data.forEach((category) => {
        const categoryKey = category.key;
        const categorySelection = currentSelections[categoryKey];
        const isCategorySelected = categorySelection?.isChecked || false;
        const categoryTextValue = categorySelection?.textValue || '';

        // Check category validation
        if (
          isCategorySelected &&
          category.hasTextField &&
          (!categoryTextValue || categoryTextValue.trim() === '')
        ) {
          errors.push(
            `${category.label} ${
              t ? t('fields.description_required') : 'requires a description'
            }`
          );
        }

        // Check subtypes validation
        if (category.subChoice) {
          category.subChoice.forEach((subtype) => {
            const subtypeKey = `${categoryKey}.${subtype.key}`;
            const subtypeSelection = currentSelections[subtypeKey];
            const isSubtypeSelected = subtypeSelection?.isChecked || false;
            const subtypeTextValue = subtypeSelection?.textValue || '';

            if (
              isSubtypeSelected &&
              subtype.hasTextField &&
              (!subtypeTextValue || subtypeTextValue.trim() === '')
            ) {
              errors.push(
                `${subtype.label} ${
                  t
                    ? t('fields.description_required')
                    : 'requires a description'
                }`
              );
            }
          });
        }
      });

      const isValid = errors.length === 0;
      return { isValid, errors };
    },
    [data, t]
  );

  // Run validation whenever selections change
  useEffect(() => {
    if (onValidationChange) {
      const { isValid, errors } = validateSelections(selections);
      onValidationChange(isValid, errors);
    }
  }, [selections, data, onValidationChange, validateSelections]);

  // Helper function to clear all other level 1 categories when behavior is "single"
  const clearOtherCategories = useCallback(
    (
      currentSelections: Record<string, TreeSelectionValue>,
      keepCategoryKey: string
    ) => {
      if (behavior !== 'single') return currentSelections;

      const newSelections = { ...currentSelections };

      data.forEach((category) => {
        if (category.key !== keepCategoryKey) {
          // Remove the category itself
          delete newSelections[category.key];

          // Remove all its children
          if (category.subChoice) {
            category.subChoice.forEach((child) => {
              const childKey = `${category.key}.${child.key}`;
              delete newSelections[childKey];
            });
          }
        }
      });

      return newSelections;
    },
    [behavior, data]
  );

  const handleOptionToggle = (optionKey: string) => {
    if (disabled) return;

    const currentSelection = selections[optionKey];
    const isCurrentlySelected = currentSelection?.isChecked || false;

    let newSelections = {
      ...selections,
      [optionKey]: {
        key: optionKey,
        isChecked: !isCurrentlySelected,
        textValue: isCurrentlySelected
          ? undefined
          : currentSelection?.textValue || '',
      },
    };

    // If deselecting, remove the entry completely
    if (isCurrentlySelected) {
      delete newSelections[optionKey];
    } else {
      // If selecting and behavior is "single", check if this is a level 1 category
      const isLevel1Category = data.some(
        (category) => category.key === optionKey
      );
      if (behavior === 'single' && isLevel1Category) {
        newSelections = clearOtherCategories(newSelections, optionKey);
      }
    }

    setSelections(newSelections);
    onValueChange?.(newSelections);

    // Notify react-hook-form
    if (typeof fieldOnChange === 'function') {
      fieldOnChange({
        target: {
          name,
          type: 'checkbox',
          value: optionKey,
          checked: !isCurrentlySelected,
        },
      } as React.ChangeEvent<HTMLInputElement>);
    }
  };

  const handleParentToggle = (category: TreeSelectionOption) => {
    if (disabled) return;

    const categoryKey = category.key;
    const currentSelection = selections[categoryKey];
    const isCurrentlySelected = currentSelection?.isChecked || false;

    let newSelections = { ...selections };

    if (!isCurrentlySelected) {
      // If behavior is "single", clear other categories first
      if (behavior === 'single') {
        newSelections = clearOtherCategories(newSelections, categoryKey);
      }

      // Selecting parent: select first child if children exist
      if (category.subChoice && category.subChoice.length > 0) {
        const firstChildKey = `${categoryKey}.${category.subChoice[0].key}`;
        newSelections[firstChildKey] = {
          key: firstChildKey,
          isChecked: true,
          textValue: '',
        };
      }
      // Also select the parent
      newSelections[categoryKey] = {
        key: categoryKey,
        isChecked: true,
        textValue: currentSelection?.textValue || '',
      };
    } else {
      // Deselecting parent: remove parent and all children
      delete newSelections[categoryKey];
      if (category.subChoice) {
        category.subChoice.forEach((child) => {
          const childKey = `${categoryKey}.${child.key}`;
          delete newSelections[childKey];
        });
      }
    }

    setSelections(newSelections);
    onValueChange?.(newSelections);

    // Notify react-hook-form
    if (typeof fieldOnChange === 'function') {
      fieldOnChange({
        target: {
          name,
          type: 'checkbox',
          value: categoryKey,
          checked: !isCurrentlySelected,
        },
      } as React.ChangeEvent<HTMLInputElement>);
    }
  };

  const handleRadioChange = (categoryKey: string, childKey: string) => {
    if (disabled) return;

    let newSelections = { ...selections };

    // If behavior is "single", clear other categories first
    if (behavior === 'single') {
      newSelections = clearOtherCategories(newSelections, categoryKey);
    }

    // Find the category to get all children
    const category = data.find((cat) => cat.key === categoryKey);
    if (!category?.subChoice) return;

    // Clear all children for this category
    category.subChoice.forEach((child) => {
      const childOptionKey = `${categoryKey}.${child.key}`;
      delete newSelections[childOptionKey];
    });

    // Set the selected child
    const selectedChildKey = `${categoryKey}.${childKey}`;
    newSelections[selectedChildKey] = {
      key: selectedChildKey,
      isChecked: true,
      textValue: '',
    };

    // Ensure parent is also selected
    newSelections[categoryKey] = {
      key: categoryKey,
      isChecked: true,
      textValue: selections[categoryKey]?.textValue || '',
    };

    setSelections(newSelections);
    onValueChange?.(newSelections);

    // Notify react-hook-form
    if (typeof fieldOnChange === 'function') {
      fieldOnChange({
        target: {
          name,
          type: 'radio',
          value: selectedChildKey,
          checked: true,
        },
      } as React.ChangeEvent<HTMLInputElement>);
    }
  };

  const handleTextChange = (optionKey: string, textValue: string) => {
    if (disabled) return;

    const newSelections = {
      ...selections,
      [optionKey]: {
        key: optionKey,
        isChecked: true, // Ensure it's checked if we're adding text
        textValue,
      },
    };

    setSelections(newSelections);
    onValueChange?.(newSelections);
  };

  return (
    <>
      {/* All categories and their subtypes displayed together */}
      <div className="flex flex-col gap-2.5">
        {data.map((category) => {
          const categoryKey = category.key;
          const categorySelection = selections[categoryKey];

          // For categories with single behavior, check if any children are selected
          const hasSelectedChildren =
            category.childrenBehavior === 'single' && category.subChoice
              ? category.subChoice.some((child) => {
                  const childKey = `${categoryKey}.${child.key}`;
                  return selections[childKey]?.isChecked || false;
                })
              : false;

          const isCategorySelected =
            categorySelection?.isChecked || hasSelectedChildren;
          const categoryInputId = `${name ?? 'tree'}-${categoryKey}`;
          const categoryTextValue = categorySelection?.textValue || '';

          // Check if category is invalid (selected with hasTextField but no text value)
          const isCategoryInvalid =
            isCategorySelected &&
            category.hasTextField &&
            (!categoryTextValue || categoryTextValue.trim() === '');

          return (
            <div key={category.key}>
              {/* Category with optional checkbox */}
              <div className="">
                {category.childrenBehavior === 'single' ||
                !category.subChoice ||
                category.subChoice.length === 0 ? (
                  <div className="flex flex-col gap-2.5">
                    <div className=" flex items-center">
                      {/* Hidden real input for form handling */}
                      <input
                        id={categoryInputId}
                        type="checkbox"
                        name={`${name}-categories`}
                        value={categoryKey}
                        checked={isCategorySelected}
                        disabled={disabled}
                        onChange={() =>
                          category.childrenBehavior === 'single'
                            ? handleParentToggle(category)
                            : handleOptionToggle(categoryKey)
                        }
                        onBlur={fieldOnBlur}
                        className="sr-only absolute opacity-0 pointer-events-none"
                      />

                      {/* Custom SVG checkbox */}
                      <button
                        type="button"
                        onClick={() =>
                          category.childrenBehavior === 'single'
                            ? handleParentToggle(category)
                            : handleOptionToggle(categoryKey)
                        }
                        disabled={disabled}
                        className={cn(
                          'mr-2 flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-el-blue-500 focus:ring-offset-1 rounded',
                          disabled
                            ? 'opacity-50 cursor-not-allowed'
                            : 'cursor-pointer hover:scale-105 transition-transform'
                        )}
                      >
                        <CircleIcon
                          isSelected={isCategorySelected}
                          isInvalid={isCategoryInvalid}
                        />
                      </button>

                      <label
                        htmlFor={categoryInputId}
                        className={cn(
                          'text-14 font-medium cursor-pointer',
                          disabled && 'opacity-50 cursor-not-allowed'
                        )}
                      >
                        {category.label}
                      </label>
                    </div>

                    {/* Text field for category if it has one and is selected */}
                    {isCategorySelected && category.hasTextField && (
                      <div className="ml-6">
                        <Input
                          type="text"
                          placeholder={
                            category.textFieldPlaceholder ||
                            'Entrer les détails...'
                          }
                          value={categoryTextValue}
                          onChange={(e) =>
                            handleTextChange(categoryKey, e.target.value)
                          }
                          disabled={disabled}
                          className={cn(
                            'text-12',
                            isCategoryInvalid &&
                              'border-red-500 focus:border-red-500 focus:ring-red-500'
                          )}
                        />
                        {isCategoryInvalid && (
                          <p className="text-12 text-el-red-500 ">
                            {t
                              ? t('fields.field_required')
                              : 'This field is required'}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <span className="text-14 font-medium text-el-grey-800">
                    {category.label}
                  </span>
                )}
              </div>

              {/* Subtypes as radio buttons (single behavior) or checkboxes */}
              {category.subChoice && category.subChoice.length > 0 && (
                <div className="flex flex-col gap-1.5 ml-6 mt-1">
                  {category.subChoice.map((subtype) => {
                    const subtypeKey = `${category.key}.${subtype.key}`;
                    const currentSelection = selections[subtypeKey];
                    const isSelected = currentSelection?.isChecked || false;
                    const inputId = `${name ?? 'tree'}-${subtypeKey}`;
                    const textValue = currentSelection?.textValue || '';

                    // Check if subtype is invalid (selected with hasTextField but no text value)
                    const isSubtypeInvalid =
                      isSelected &&
                      subtype.hasTextField &&
                      (!textValue || textValue.trim() === '');

                    return (
                      <div key={subtypeKey} className="flex flex-col gap-2">
                        <div className="flex items-center">
                          {/* Hidden real input for form handling */}
                          <input
                            id={inputId}
                            type={
                              category.childrenBehavior === 'single'
                                ? 'radio'
                                : 'checkbox'
                            }
                            name={
                              category.childrenBehavior === 'single'
                                ? category.key
                                : `${name}-subtypes`
                            }
                            value={
                              category.childrenBehavior === 'single'
                                ? subtype.key
                                : subtypeKey
                            }
                            checked={isSelected}
                            disabled={disabled}
                            onChange={() =>
                              category.childrenBehavior === 'single'
                                ? handleRadioChange(category.key, subtype.key)
                                : handleOptionToggle(subtypeKey)
                            }
                            onBlur={fieldOnBlur}
                            className="sr-only absolute opacity-0 pointer-events-none"
                          />

                          {/* Custom SVG radio button for single behavior */}
                          {category.childrenBehavior === 'single' ? (
                            <button
                              type="button"
                              onClick={() =>
                                handleRadioChange(category.key, subtype.key)
                              }
                              disabled={disabled}
                              className={cn(
                                'mr-2 flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-el-blue-500 focus:ring-offset-1 rounded-full',
                                disabled
                                  ? 'opacity-50 cursor-not-allowed'
                                  : 'cursor-pointer hover:scale-105 transition-transform'
                              )}
                            >
                              <CircleIcon
                                isSelected={isSelected}
                                isInvalid={isSubtypeInvalid}
                              />
                            </button>
                          ) : (
                            /* Custom SVG checkbox for non-single behavior */
                            <button
                              type="button"
                              onClick={() => handleOptionToggle(subtypeKey)}
                              disabled={disabled}
                              className={cn(
                                'mr-2 flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-el-blue-500 focus:ring-offset-1 rounded',
                                disabled
                                  ? 'opacity-50 cursor-not-allowed'
                                  : 'cursor-pointer hover:scale-105 transition-transform'
                              )}
                            >
                              <CircleIcon
                                isSelected={isSelected}
                                isInvalid={isSubtypeInvalid}
                              />
                            </button>
                          )}

                          <label
                            htmlFor={inputId}
                            className={cn(
                              'text-14 cursor-pointer',
                              disabled && 'opacity-50 cursor-not-allowed'
                            )}
                          >
                            {subtype.label}
                          </label>
                        </div>

                        {/* Text field for this subtype if it has one and is selected */}
                        {isSelected && subtype.hasTextField && (
                          <div className="ml-6 relative -mt-1">
                            <Input
                              type="text"
                              placeholder={
                                subtype.textFieldPlaceholder ||
                                (t
                                  ? t('fields.default_text_placeholder')
                                  : 'Enter details...')
                              }
                              value={textValue}
                              onChange={(e) =>
                                handleTextChange(subtypeKey, e.target.value)
                              }
                              disabled={disabled}
                              className={cn(
                                'text-12',
                                isSubtypeInvalid &&
                                  'border-red-500 focus:border-red-500 focus:ring-red-500'
                              )}
                            />
                            {isSubtypeInvalid && (
                              <p className="text-11 text-red-500 mt-1">
                                {t
                                  ? t('fields.field_required')
                                  : 'This field is required'}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
