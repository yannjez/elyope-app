'use client';

import {
  Button,
  FormField,
  FormPanel,
  FormSeparator,
  Input,
  Toggle,
  PageHeader,
  BriefCaseIcon,
  ZodForm,
  z,
} from '@app-test2/shared-components';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  createStructure,
  getStructureById,
  updateStructure,
} from './StructureListController';
import { useRouter } from 'next/navigation';

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
});

export type StructureFormData = z.infer<typeof structureSchema>;

type StructureUpsertContentProps =
  | { mode: 'create' }
  | { mode: 'edit'; id: string };

export default function StructureUpsertContent(
  props: StructureUpsertContentProps
) {
  const router = useRouter();
  const isEdit = props.mode === 'edit';
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
        }
  );

  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      const s = await getStructureById((props as any).id as string);
      setDefaults({
        name: s?.name || '',
        description: s?.description || '',
        address1: s?.address1 || '',
        address2: s?.address2 || '',
        zipcode: s?.zipcode || '',
        town: s?.town || '',
        phone: s?.phone || '',
        mobile: s?.mobile || '',
        account_lastname: s?.account_lastname || '',
        account_firstname: s?.account_firstname || '',
        account_email: s?.account_email || '',
        is_structure_active:
          typeof s?.is_structure_active === 'boolean'
            ? s.is_structure_active
            : true,
      });
    })();
  }, [isEdit, props]);

  const handleSubmit = async (data: StructureFormData) => {
    if (isEdit) {
      await updateStructure((props as any).id as string, data);
    } else {
      await createStructure(data);
    }
    router.push('/structures');
  };

  if (!defaults) return null;

  return (
    <>
      <PageHeader
        title={isEdit ? 'Edit Structure' : 'Create Structure'}
        icon={<BriefCaseIcon className="w-full" />}
        action={
          <Link href="/structures" className="button-primary min-w-40">
            Back to list
          </Link>
        }
      />

      <FormPanel title="Structure" className="main-container">
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
