'use client';

import { ZodForm } from './ZodForm';
import { FormField } from './FormField';
import Input from './Input';
import Button from './Button';
import { userRegistrationSchema, type UserRegistrationData } from './schemas';

export function ExampleRegistrationForm() {
  const handleSubmit = (data: UserRegistrationData) => {
    console.log('Form submitted:', data);
    // Handle form submission here
  };

  return (
    <ZodForm
      schema={userRegistrationSchema}
      onSubmit={handleSubmit}
      className="space-y-4 max-w-md mx-auto p-6"
    >
      <FormField name="firstName" label="First Name">
        <Input placeholder="Enter your first name" />
      </FormField>

      <FormField name="lastName" label="Last Name">
        <Input placeholder="Enter your last name" />
      </FormField>

      <FormField name="email" label="Email">
        <Input type="email" placeholder="Enter your email" />
      </FormField>

      <FormField name="password" label="Password">
        <Input type="password" placeholder="Enter your password" />
      </FormField>

      <FormField name="confirmPassword" label="Confirm Password">
        <Input type="password" placeholder="Confirm your password" />
      </FormField>

      <Button type="submit" className="w-full">
        Register
      </Button>
    </ZodForm>
  );
}
