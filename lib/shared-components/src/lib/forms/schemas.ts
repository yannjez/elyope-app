'use client';

import { z } from 'zod';

// Common validation schemas
export const emailSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const passwordSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const nameSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
});

// Combined schemas
export const userRegistrationSchema = z.object({
  email: z.string().email('Invalid email address'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  roles: z.array(z.enum(['VETERINARIAN', 'INTERPRETER', 'ADMIN'])),
});

export const userLoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const userProfileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
});

// Generic form schemas
export const createFormSchema = <T extends z.ZodRawShape>(schema: T) =>
  z.object(schema);

// Export types
export type EmailFormData = z.infer<typeof emailSchema>;
export type PasswordFormData = z.infer<typeof passwordSchema>;
export type NameFormData = z.infer<typeof nameSchema>;
export type UserRegistrationData = z.infer<typeof userRegistrationSchema>;
export type UserLoginData = z.infer<typeof userLoginSchema>;
export type UserProfileData = z.infer<typeof userProfileSchema>;
