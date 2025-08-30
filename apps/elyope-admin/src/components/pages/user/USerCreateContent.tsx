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
import { redirect } from 'next/navigation';
import { useTranslations } from 'next-intl';

export default function UserCreateContent() {
  const t = useTranslations('Data.User');
  const tCommon = useTranslations('Data.Common');

  const handleSubmit = async (data: UserRegistrationData) => {
    const user = await createUser(data);
    if (user) {
      redirect(`/user/${user.externalId}`);
    }
  };
  return (
    <>
      <PageHeader
        title={t('create_title')}
        icon={<UserIcon className="w-full" />}
        action={
          <Link
            href="/"
            className="button-primary-inverse min-w-40 whitespace-nowrap"
          >
            {tCommon('navigation.back_to_list')}
          </Link>
        }
      />

      <FormPanel title={t('form_title')} className="main-container">
        <ZodForm
          schema={userRegistrationSchema}
          onSubmit={handleSubmit}
          defaultValues={{ firstName: '', lastName: '', email: '', roles: [] }}
          className="space-y-2 "
        >
          <FormField name="firstName" label={t('fields.first_name.label')}>
            <Input placeholder={t('fields.first_name.placeholder')} />
          </FormField>

          <FormField name="lastName" label={t('fields.last_name.label')}>
            <Input placeholder={t('fields.last_name.placeholder')} />
          </FormField>

          <FormField name="email" label={t('fields.email.label')}>
            <Input type="email" placeholder={t('fields.email.placeholder')} />
          </FormField>

          <FormField name="roles" label={t('fields.roles.label')}>
            <SelectMultiButtons
              minSelections={1}
              maxSelections={3}
              name="roles"
              options={[
                { label: t('roles.veterinarian'), value: 'VETERINARIAN' },
                { label: t('roles.interpreter'), value: 'INTERPRETER' },
                { label: t('roles.admin'), value: 'ADMIN' },
              ]}
              t={(key, options) => {
                if (key === 'Validation.SelectMultiButtons.min_selections') {
                  return t('validation.min_selections', options);
                }
                if (key === 'Validation.SelectMultiButtons.max_selections') {
                  return t('validation.max_selections', options);
                }
                return key;
              }}
            />
          </FormField>

          <FormSeparator className="w-full my-4" />
          <Button type="submit" className="button-primary ">
            {tCommon('actions.save')}
          </Button>
        </ZodForm>
      </FormPanel>
    </>
  );
}
