'use client';

import {
  Button,
  FormField,
  FormPanel,
  FormSeparator,
  Input,
  PageHeader,
  SelectMultiButtons,
  UserIcon,
  UserRegistrationData,
  userRegistrationSchema,
  ZodForm,
} from '@app-test2/shared-components';
import Link from 'next/link';
import { createUser } from './UserListController';

export default function UserCreateContent() {
  const handleSubmit = async (data: UserRegistrationData) => {
    await createUser(data);
  };
  return (
    <>
      <PageHeader
        title="Create User"
        icon={<UserIcon className="w-full" />}
        action={
          <Link href="/" className="button-primary min-w-40">
            Back to list
          </Link>
        }
      />

      <FormPanel title="User " className="main-container">
        <ZodForm
          schema={userRegistrationSchema}
          onSubmit={handleSubmit}
          defaultValues={{ firstName: '', lastName: '', email: '', roles: [] }}
          className="space-y-2 "
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

          <FormField name="roles" label="Roles">
            <SelectMultiButtons
              minSelections={1}
              maxSelections={3}
              name="roles"
              options={[
                { label: 'Veterinarian', value: 'VETERINARIAN' },
                { label: 'Interpreter', value: 'INTERPRETER' },
                { label: 'Admin', value: 'ADMIN' },
              ]}
            />
          </FormField>

          <FormSeparator className="w-full my-4" />
          <Button type="submit" className="button-primary min-w-40">
            ↓ Sauvegarder
          </Button>
        </ZodForm>
      </FormPanel>
    </>
  );
}
