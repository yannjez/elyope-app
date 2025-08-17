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

export const structureSchema = z.object({
  name: z.string().min(2, 'Name is required'),
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

export type StructureFormData = z.infer<typeof structureSchema>;

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
  const router = useRouter();
  const isEdit = mode === 'edit';
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
    } else {
      await createStructure(data);
    }
    router.refresh();
  };

  if (!defaults) return null;

  return (
    <>
      <FormPanel title="Structure data" className="main-container">
        <ZodForm
          schema={structureSchema}
          onSubmit={handleSubmit}
          defaultValues={defaults}
          className="space-y-2"
        >
          <FormField name="name" label="Name" isMandatory>
            <Input placeholder="Enter structure name" />
          </FormField>

          <FormField name="description" label="Description">
            <Input placeholder="Short description" />
          </FormField>
          <FormSeparator className="w-full my-4" />
          <FormField name="address1" label="Address 1">
            <Input placeholder="Address line 1" />
          </FormField>

          <FormField name="address2" label="Address 2">
            <Input placeholder="Address line 2" />
          </FormField>

          <FormField name="zipcode" label="Zipcode">
            <Input placeholder="Zipcode" />
          </FormField>
          <FormField name="town" label="Town">
            <Input placeholder="Town" />
          </FormField>

          <FormField name="phone" label="Phone">
            <Input type="tel" placeholder="Phone number" />
          </FormField>
          <FormField name="mobile" label="Mobile">
            <Input type="tel" placeholder="Mobile number" />
          </FormField>
          <FormSeparator className="w-full my-4" />
          <FormField name="account_lastname" label="Account Last name">
            <Input placeholder="Last name" />
          </FormField>
          <FormField name="account_firstname" label="Account First name">
            <Input placeholder="First name" />
          </FormField>

          <FormField name="account_email" label="Contact Email" isMandatory>
            <Input type="email" placeholder="Email" />
          </FormField>

          <FormField
            name="interpreterId"
            label="Interpreter"
            className="w-full"
          >
            <SelectInterpreter
              currentInterpreter={currentInterpreter}
              setDefaults={setDefaults}
              defaults={defaults}
              listInterpreters={listInterpreters}
            />
          </FormField>
          <FormField name="is_structure_active" label="Active">
            <Toggle checkedLabel="" uncheckedLabel="" />
          </FormField>

          <FormSeparator className="w-full my-4" />
          <Button type="submit" className="button-primary min-w-40">
            ↓ Save
          </Button>
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
  return (
    <SelectEntity
      className="w-full"
      name="interpreterId"
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
