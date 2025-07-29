# React Hook Form + Zod Integration

This library provides a complete form solution using React Hook Form and Zod for validation.

## Components

### ZodForm
A form component that automatically integrates Zod validation with React Hook Form.

```tsx
import { ZodForm, FormField, Input, Button, userRegistrationSchema } from '@app-test2/shared-components';

function MyForm() {
  return (
    <ZodForm
      schema={userRegistrationSchema}
      onSubmit={(data) => console.log(data)}
    >
      <FormField name="email" label="Email">
        <Input type="email" />
      </FormField>
      <Button type="submit">Submit</Button>
    </ZodForm>
  );
}
```

### FormField
A field wrapper that automatically handles form registration and error display.

```tsx
<FormField name="email" label="Email">
  <Input type="email" placeholder="Enter your email" />
</FormField>
```

## Available Schemas

- `emailSchema` - Email validation
- `passwordSchema` - Password validation
- `nameSchema` - Name validation
- `userRegistrationSchema` - Complete registration form
- `userLoginSchema` - Login form
- `userProfileSchema` - Profile update form

## Hooks

All React Hook Form hooks are available:

```tsx
import { useForm, useFormContext, useWatch } from '@app-test2/shared-components';
```

## Custom Schemas

You can create custom schemas using Zod:

```tsx
import { z } from '@app-test2/shared-components';

const customSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
});

function CustomForm() {
  return (
    <ZodForm schema={customSchema} onSubmit={handleSubmit}>
      <FormField name="title" label="Title">
        <Input />
      </FormField>
      <FormField name="description" label="Description">
        <Input />
      </FormField>
    </ZodForm>
  );
}
``` 