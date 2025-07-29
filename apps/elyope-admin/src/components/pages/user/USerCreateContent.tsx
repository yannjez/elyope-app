'use client';

import {
  Button,
  FormField,
  FormPanel,
  FormSeparator,
  Input,
  PageHeader,
  UserIcon,
  UserRegistrationData,
  userRegistrationSchema,
  ZodForm,
} from '@app-test2/shared-components';
import Link from 'next/link';
import { createUser } from './UserListController';

export default function UserCreateContent() {
  const handleSubmit = (data: UserRegistrationData) => {
    createUser(data).then((res) => {
      console.log(res);
    });
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

          <FormField name="password" label="Password">
            <Input type="password" placeholder="Enter your password" />
          </FormField>

          <FormField name="confirmPassword" label="Confirm Password">
            <Input type="password" placeholder="Confirm your password" />
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
