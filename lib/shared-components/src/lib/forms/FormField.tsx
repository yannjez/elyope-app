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
      <div className={cn('flex items-center gap-2', className)}>
        {label && (
          <label
            htmlFor={name}
            className="block min-w-[220px] text-12 text-el-grey-500"
          >
            {label}
          </label>
        )}
        <div className="text-red-600 text-sm">
          Error: FormField must be used inside a Form component
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
    <div>
      <div className={cn('flex items-center gap-2', className)}>
        {label && (
          <label
            htmlFor={name}
            className="block min-w-[220px] text-12 text-el-grey-500"
          >
            {label}
            {isMandatory && <span className="text-el-red-500">*</span>}
          </label>
        )}

        {React.cloneElement(children, {
          ...register(name),
          id: name,
          'aria-invalid': errors[name] ? 'true' : 'false',
        } as React.InputHTMLAttributes<HTMLInputElement> & React.SelectHTMLAttributes<HTMLSelectElement>)}

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
  );
}
