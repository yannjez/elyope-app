'use client';

import {
  Button,
  FormField,
  SelectEntity,
  FormPanel,
  FormSeparator,
  Input,
  Toggle,
  ZodForm,
  z,
  useFormContext,
} from '@app-test2/shared-components';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { createStructure, updateStructure } from './StructureController';
import { useRouter } from 'next/navigation';
import { FullUser, Structure } from '@elyope/db';
import { useTranslations } from 'next-intl';

// Schema will be created inside component to access translations
const createStructureSchema = (nameRequiredMessage: string) =>
  z.object({
    name: z.string().min(2, nameRequiredMessage),
    description: z.string().optional(),
    address1: z.string().optional(),
    address2: z.string().optional(),
    zipcode: z.string().optional(),
    town: z.string().optional(),
    phone: z.string().optional(),
    mobile: z.string().optional(),
    account_lastname: z.string().optional(),
    account_firstname: z.string().optional(),
    account_email: z.string().email().optional(),
    is_structure_active: z.boolean().optional(),
    interpreterId: z.string().optional(),
  });

export type StructureFormData = z.infer<
  ReturnType<typeof createStructureSchema>
>;

export type StructureUpsertContentProps = {
  mode: 'create' | 'edit';
  id?: string;
  _structure?: Structure;
  _interpreters: FullUser[];
};

export default function StructureUpsertContent({
  mode,
  id = '',
  _structure,
  _interpreters,
}: StructureUpsertContentProps) {
  const t = useTranslations('Data.Structure.create');
  const tCommon = useTranslations('Data.Common');
  const router = useRouter();
  const isEdit = mode === 'edit';

  // Create schema with translated validation messages
  const structureSchema = createStructureSchema(t('validation.name_required'));
  const [defaults, setDefaults] = useState<StructureFormData | null>(
    isEdit
      ? null
      : {
          name: '',
          description: '',
          address1: '',
          address2: '',
          zipcode: '',
          town: '',
          phone: '',
          mobile: '',
          account_lastname: '',
          account_firstname: '',
          account_email: '',
          is_structure_active: true,
          interpreterId: '',
        }
  );

  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      setDefaults({
        name: _structure?.name || '',
        description: _structure?.description || '',
        address1: _structure?.address1 || '',
        address2: _structure?.address2 || '',
        zipcode: _structure?.zipcode || '',
        town: _structure?.town || '',
        phone: _structure?.phone || '',
        mobile: _structure?.mobile || '',
        account_lastname: _structure?.account_lastname || '',
        account_firstname: _structure?.account_firstname || '',
        account_email: _structure?.account_email || '',
        is_structure_active:
          typeof _structure?.is_structure_active === 'boolean'
            ? _structure.is_structure_active
            : true,
        interpreterId: _structure?.interpreterId || '',
      });
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const listInterpreters = useCallback((keyword?: string) => {
    return _interpreters.filter((interpreter) =>
      interpreter.fullName.toLowerCase().includes(keyword?.toLowerCase() || '')
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const currentInterpreter = useMemo(() => {
    if (!defaults?.interpreterId) return null;
    return (
      _interpreters.find(
        (interpreter) => interpreter.id === defaults?.interpreterId
      ) || null
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaults?.interpreterId]);

  const handleSubmit = async (data: StructureFormData) => {
    if (isEdit) {
      await updateStructure(id, data);
      router.refresh();
    } else {
      await createStructure(data);
      router.push('/structures');
    }
  };

  return (
    <>
      <FormPanel title={t('form_title')} className="main-container w-full">
        <ZodForm
          schema={structureSchema}
          onSubmit={handleSubmit}
          defaultValues={defaults || {}}
          className="space-y-2"
        >
          <div className="flex flex-col gap-1">
            <FormField name="name" label={t('fields.name.label')} isMandatory>
              <Input placeholder={t('fields.name.placeholder')} />
            </FormField>

            <FormField name="description" label={t('fields.description.label')}>
              <Input placeholder={t('fields.description.placeholder')} />
            </FormField>

            <FormSeparator className="w-full my-4" />

            <FormField name="address1" label={t('fields.address1.label')}>
              <Input placeholder={t('fields.address1.placeholder')} />
            </FormField>

            <FormField name="address2" label={t('fields.address2.label')}>
              <Input placeholder={t('fields.address2.placeholder')} />
            </FormField>

            <FormField name="zipcode" label={t('fields.zipcode.label')}>
              <Input placeholder={t('fields.zipcode.placeholder')} />
            </FormField>

            <FormField name="town" label={t('fields.town.label')}>
              <Input placeholder={t('fields.town.placeholder')} />
            </FormField>

            <FormField name="phone" label={t('fields.phone.label')}>
              <Input type="tel" placeholder={t('fields.phone.placeholder')} />
            </FormField>

            <FormField name="mobile" label={t('fields.mobile.label')}>
              <Input type="tel" placeholder={t('fields.mobile.placeholder')} />
            </FormField>

            <FormSeparator className="w-full my-4" />

            <FormField
              name="account_lastname"
              label={t('fields.account_lastname.label')}
            >
              <Input placeholder={t('fields.account_lastname.placeholder')} />
            </FormField>

            <FormField
              name="account_firstname"
              label={t('fields.account_firstname.label')}
            >
              <Input placeholder={t('fields.account_firstname.placeholder')} />
            </FormField>

            <FormField
              name="account_email"
              label={t('fields.account_email.label')}
              isMandatory
            >
              <Input
                type="email"
                placeholder={t('fields.account_email.placeholder')}
              />
            </FormField>

            <FormField
              name="interpreterId"
              label={t('fields.interpreter.label')}
            >
              <SelectInterpreter
                currentInterpreter={currentInterpreter}
                setDefaults={setDefaults}
                defaults={defaults || {}}
                listInterpreters={listInterpreters}
              />
            </FormField>

            <FormField
              name="is_structure_active"
              label={t('fields.active.label')}
            >
              <Toggle checkedLabel="" uncheckedLabel="" />
            </FormField>

            <FormSeparator className="w-full my-4" />
            <Button type="submit" className="button-primary ">
              {tCommon('actions.save')}
            </Button>
          </div>
        </ZodForm>
      </FormPanel>
    </>
  );
}

function SelectInterpreter({
  currentInterpreter,
  setDefaults,
  defaults,
  listInterpreters,
}: {
  currentInterpreter: FullUser | null;
  setDefaults: (defaults: StructureFormData) => void;
  defaults: StructureFormData;
  listInterpreters: (keyword?: string) => FullUser[];
}) {
  const form = useFormContext<StructureFormData>();
  const t = useTranslations('Data.Structure.create');
  return (
    <SelectEntity
      className="w-full min-w-0"
      name="interpreterId"
      placeholder={t('fields.interpreter.placeholder')}
      value={currentInterpreter}
      onChange={(value) => {
        setDefaults({
          ...defaults,
          interpreterId: value?.id || '',
        });
        if (form) {
          form.setValue('interpreterId', value?.id || '');
          form.trigger('interpreterId');
        }
      }}
      getItemLabel={(item) => item.fullName}
      loadInitial={() => Promise.resolve(listInterpreters())}
      search={(keyword) => Promise.resolve(listInterpreters(keyword))}
    />
  );
}
