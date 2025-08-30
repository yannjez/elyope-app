'use client';

import React from 'react';
import {
  useForm,
  UseFormProps,
  FieldValues,
  SubmitHandler,
  FormProvider,
} from 'react-hook-form';

export interface FormProps<T extends FieldValues>
  extends Omit<React.FormHTMLAttributes<HTMLFormElement>, 'onSubmit'> {
  defaultValues?: UseFormProps<T>['defaultValues'];
  onSubmit: SubmitHandler<T>;
  children: React.ReactNode;
  className?: string;
}

export function Form<T extends FieldValues>({
  defaultValues,
  onSubmit,
  children,
  className = '',
  ...formProps
}: FormProps<T>) {
  const methods = useForm<T>({
    defaultValues,
  });

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className={className}
        {...formProps}
      >
        {children}
      </form>
    </FormProvider>
  );
}

// Export types for convenience
export type { FieldValues, SubmitHandler, UseFormProps } from 'react-hook-form';
