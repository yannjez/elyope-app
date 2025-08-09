# React Hook Form + Zod Integration

This library provides a complete form solution using React Hook Form and Zod for validation.

## Components

### ZodForm

A form component that automatically integrates Zod validation with React Hook Form.

```tsx
import {
  ZodForm,
  FormField,
  Input,
  Button,
  userRegistrationSchema,
} from '@app-test2/shared-components';

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

### SelectMultiButtons

A multi-select component that uses buttons for selection instead of a dropdown.

```tsx
import { SelectMultiButtons } from '@app-test2/shared-components';

const options = [
  { label: 'Option 1', value: 'option1' },
  { label: 'Option 2', value: 'option2' },
  { label: 'Option 3', value: 'option3' },
];

function MyMultiSelect() {
  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  return (
    <SelectMultiButtons
      options={options}
      value={selectedValues}
      onValuesChange={setSelectedValues}
      placeholder="Select multiple options"
      maxSelections={3}
      minSelections={1}
    />
  );
}
```

**Props:**

- `options: Option[]` - Array of options to select from
- `value: string[]` - Currently selected values
- `onValuesChange: (value: string[]) => void` - Callback when selection changes (use this in controlled mode). When used within `FormField`, `name` and hidden checkboxes ensure values are registered correctly.
- `placeholder?: string` - Placeholder text when no options are selected
- `disabled?: boolean` - Whether the component is disabled
- `maxSelections?: number` - Maximum number of selections allowed
- `minSelections?: number` - Minimum number of selections required
- `className?: string` - Additional CSS classes
- `aria-label?: string` - Accessibility label
- `aria-describedby?: string` - Accessibility description

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
import {
  useForm,
  useFormContext,
  useWatch,
} from '@app-test2/shared-components';
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
