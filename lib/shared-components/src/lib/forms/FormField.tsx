'use client';

import React from 'react';
import { useFormContext, FieldValues, Path } from 'react-hook-form';
import { cn } from '../utils/cn';
import { ExclamationCircleIcon } from '../..';

export interface FormFieldProps<T extends FieldValues> {
  name: Path<T>;
  label?: string;
  children: React.ReactElement;
  className?: string;
  error?: string;
  isMandatory?: boolean;
}

export function FormField<T extends FieldValues>({
  name,
  label,
  children,
  className = '',
  error,
  isMandatory = false,
}: FormFieldProps<T>) {
  const formContext = useFormContext<T>();

  // Check if we're inside a form context
  if (!formContext) {
    return (
      <div className="w-full">
        <div
          className={cn(
            'flex flex-col sm:flex-row sm:items-center gap-2',
            className
          )}
        >
          {label && (
            <label
              htmlFor={name}
              className="block sm:min-w-[220px] text-12 text-el-grey-500 mb-1 sm:mb-0"
            >
              {label}
            </label>
          )}
          <div className="flex-1 text-red-600 text-sm">
            Error: FormField must be used inside a Form component
          </div>
        </div>
      </div>
    );
  }

  const {
    register,
    formState: { errors },
  } = formContext;
  const fieldError = (errors[name]?.message as string) || error;

  return (
    <div className="w-full">
      <div
        className={cn(
          'flex flex-col md:flex-row md:items-center gap-1',
          className
        )}
      >
        {label && (
          <label
            htmlFor={name}
            className="block sm:min-w-[220px] text-12 text-el-grey-500"
          >
            {label}
            {isMandatory && <span className="text-el-red-500">*</span>}
          </label>
        )}

        <div className="flex-1 w-full">
          {React.cloneElement(children, {
            ...register(name),
            id: name,
            'aria-invalid': errors[name] ? 'true' : 'false',
          } as React.HTMLAttributes<HTMLElement>)}

          {fieldError && (
            <p
              className="text-12 mt-1 text-red-500 flex items-center gap-2"
              role="alert"
            >
              <ExclamationCircleIcon className="min-w-4 " />
              <span>{fieldError}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
