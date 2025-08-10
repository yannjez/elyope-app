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
import { addStructureMember } from './StructureListController';
import type { FullUser } from '@elyope/db';
import { useState, useMemo } from 'react';
import type { Ref } from 'react';

type StructureUsersPanelProps = {
  structureId: string;
  onUserAdded?: () => void;
};

const addUserShema = z.object({
  id: z.string().min(2, 'Id is required'),
});

export function StructureUsersPanel(props: StructureUsersPanelProps) {
  const { structureId, onUserAdded } = props;
  const [selectedUser, setSelectedUser] = useState<FullUser | null>(null);

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
          name,
          ref: _ignoreRef,
          ...safeRest
        } = _props || {};
        const form = useFormContext<any>();
        return (
          <SelectEntity<FullUser>
            className={_className}
            {...safeRest}
            name={name}
            value={selectedUser}
            onChange={(user) => {
              const selected = user as FullUser | null;
              setSelectedUser(selected);
              if (form && name) {
                form.setValue(name as any, selected ? selected.id : '');
                form.trigger(name as any);
              }
            }}
            loadInitial={async () => {
              const { data } = await getUserList({ page: 1 });
              return (data || []).slice(0, 5) as FullUser[];
            }}
            search={async (q) => {
              const { data } = await getUserList({ page: 1, search: q });
              return (data || []).slice(0, 5) as FullUser[];
            }}
            getItemId={(u: FullUser) => u.id}
            getItemLabel={(u: FullUser) => u.fullName}
            renderValue={(u: FullUser) => u.fullName}
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
    [selectedUser]
  );

  return (
    <FormPanel title="Add User">
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
          <UserSelectInput className="w-full" name="id" />
        </div>
        <FormSeparator className="my-4" />
        <Button
          type="submit"
          className="button-primary min-w-40"
          disabled={!selectedUser}
        >
          ↓ Add
        </Button>
      </ZodForm>
    </FormPanel>
  );
}

export default StructureUsersPanel;
