'use client';

import {
  Button,
  FormPanel,
  FormSeparator,
  SelectEntity,
  ZodForm,
  z,
  useFormContext,
} from '@app-test2/shared-components';
import { getUserList } from '@/components/pages/user/UserListController';
import { addStructureMember } from './StructureController';
import type { FullUser } from '@elyope/db';
import { useState, useMemo } from 'react';
import type { Ref } from 'react';
import { useTranslations } from 'next-intl';

type StructureUsersPanelProps = {
  structureId: string;
  onUserAdded?: () => void;
};

// Schema will be created inside component to access translations
const createAddUserSchema = (idRequiredMessage: string) =>
  z.object({
    userToAddId: z.string().min(2, idRequiredMessage),
  });

export function StructureUsersPanel(props: StructureUsersPanelProps) {
  const t = useTranslations('Data.Structure.edit.add_user_panel');
  const { structureId, onUserAdded } = props;
  const [selectedUser, setSelectedUser] = useState<FullUser | null>(null);

  // Create schema with translated validation messages
  const addUserShema = createAddUserSchema(t('validation.id_required'));

  // Adapter to avoid RHF register onChange overriding SelectEntity's onChange
  type UserSelectInputProps = {
    className?: string;
    name?: string;
    onChange?: (event: unknown) => void;
    onBlur?: (event: unknown) => void;
    ref?: Ref<unknown>;
  } & Record<string, unknown>;

  const UserSelectInput = useMemo(
    () =>
      function UserSelectInputComponent(_props: UserSelectInputProps) {
        const {
          className: _className,
          onChange: _ignoreOnChange,
          onBlur: _ignoreOnBlur,

          ref: _ignoreRef,
          ...safeRest
        } = _props || {};
        const form = useFormContext<{ userToAddId: string }>();
        return (
          <SelectEntity<FullUser>
            className={_className}
            placeholder={t('placeholder')}
            {...safeRest}
            name="userToAddId"
            value={selectedUser}
            onChange={(user) => {
              const selected = user as FullUser | null;
              setSelectedUser(selected);
              if (form) {
                form.setValue('userToAddId', selected ? selected.id : '');
                form.trigger('userToAddId');
              }
            }}
            loadInitial={async () => {
              const { data } = await getUserList({
                page: 1,
                role: 'VETERINARIAN',
              });
              return (data || []).slice(0, 10) as FullUser[];
            }}
            search={async (q) => {
              const { data } = await getUserList({
                page: 1,
                search: q,
                role: 'VETERINARIAN',
              });
              return (data || []).slice(0, 10) as FullUser[];
            }}
            getItemId={(u: FullUser) => u.id}
            getItemLabel={(u: FullUser) => u.fullName}
            getFormValue={(u: FullUser | null) => (u ? u.id : '')}
            renderItem={(u: FullUser) => (
              <div className="flex items-center gap-2 text-12">
                <div className="flex flex-col">
                  <span className="text-12 text-el-grey-500">
                    {u.email.slice(0, 25)}
                    {u.email.length > 25 && '...'}
                  </span>
                  <span className="text-10 text-el-grey-500">{u.fullName}</span>
                </div>
              </div>
            )}
          />
        );
      },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedUser]
  );

  return (
    <FormPanel title={t('title')} className="w-full">
      <ZodForm
        id={structureId}
        schema={addUserShema}
        onSubmit={async () => {
          if (selectedUser) {
            await addStructureMember(structureId, selectedUser.id);
            setSelectedUser(null);
            onUserAdded && onUserAdded();
          }
        }}
      >
        <div className="flex flex-col gap-2">
          <UserSelectInput className="w-full" />
        </div>
        <div className="text-12 text-el-grey-500 mt-2">
          {t('notice')}{' '}
          <span className="text-xs rounded-4 py-1 px-2 text-12 bg-el-blue-400">
            {t('role_veterinarian')}
          </span>
        </div>
        <FormSeparator className="my-4" />
        <Button
          type="submit"
          className="button-primary "
          disabled={!selectedUser}
        >
          {t('add_button')}
        </Button>
      </ZodForm>
    </FormPanel>
  );
}

export default StructureUsersPanel;
