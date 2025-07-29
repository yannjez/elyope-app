'use client';

import React from 'react';
import {
  useForm,
  UseFormProps,
  FieldValues,
  SubmitHandler,
  FormProvider,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

export interface ZodFormProps<T extends FieldValues>
  extends Omit<React.FormHTMLAttributes<HTMLFormElement>, 'onSubmit'> {
  schema: z.ZodSchema<T>;
  defaultValues?: UseFormProps<T>['defaultValues'];
  onSubmit: SubmitHandler<T>;
  children: React.ReactNode;
  className?: string;
}

export function ZodForm<T extends FieldValues>({
  schema,
  defaultValues,
  onSubmit,
  children,
  className = '',
  ...formProps
}: ZodFormProps<T>) {
  const methods = useForm<T>({
    defaultValues,
    resolver: zodResolver(schema as any),
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

// Export Zod utilities
export { z } from 'zod';
export { zodResolver } from '@hookform/resolvers/zod';
