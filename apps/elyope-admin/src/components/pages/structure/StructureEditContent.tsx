'use client';

import {
  BriefCaseIcon,
  PageHeader,
  PageMain,
  DataGrid,
  TrashIcon,
  DialogConfirm,
  PanelTitle,
} from '@app-test2/shared-components';

import Form from './StructureUpsertContent';
import Link from 'next/link';
import StructureUsersPanel from './StructureUsersPanel';
import {
  getStructureMembers,
  removeStructureMember,
} from './StructureController';
import { useMemo, useState } from 'react';
import type { FullUser, Structure } from '@elyope/db';

type StructureEditContentProps = {
  structureId: string;
  _members: FullUser[];
  _structure: Structure;
  _interpreters: FullUser[];
};

export function StructureEditContent(props: StructureEditContentProps) {
  const { structureId, _members, _structure, _interpreters } = props;
  const [members, setMembers] = useState<FullUser[]>(_members);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [confirmOpen, setConfirmOpen] = useState<boolean>(false);
  const [pendingExternalId, setPendingExternalId] = useState<string | null>(
    null
  );
  const [pendingUserName, setPendingUserName] = useState<string>('');

  const loadMembers = async () => {
    setIsLoading(true);
    try {
      const list = await getStructureMembers(structureId);
      setMembers(list as FullUser[]);
    } finally {
      setIsLoading(false);
    }
  };

  const columns = useMemo(
    () => [
      { header: 'Name', field: 'fullName' as const, isSortable: true },
      { header: 'Email', field: 'email' as const, isSortable: true },
    ],
    []
  );

  return (
    <>
      <PageHeader
        title={' Structure Edit'}
        icon={<BriefCaseIcon className="w-full" />}
        action={
          <Link href="/structures" className="button-primary-inverse">
            ← Back to list
          </Link>
        }
      />
      <PageMain className="flex gap-3 p-0 ">
        <Form
          mode="edit"
          id={structureId}
          _structure={_structure}
          _interpreters={_interpreters}
        />
        <div className="w-1/2 flex flex-col gap-3">
          <StructureUsersPanel
            structureId={structureId}
            onUserAdded={loadMembers}
          />
          <div className="bg-white   rounded-4 h-full p-2">
            <PanelTitle title="Users in this structure" />
            <DataGrid
              blueMode={true}
              className="text-12"
              columns={columns}
              data={(members || []).map((m) => ({ ...m }))}
              isLoading={isLoading}
              loadingRows={4}
              noDataMessage="No users in this structure"
              rowActions={[
                {
                  name: 'Remove from structure',
                  className: 'hover:text-el-red-500',
                  icon: <TrashIcon className="h-3/4 w-auto" />,
                  propertyKey: 'externalId',
                  onClick: (externalId) => {
                    const extId = String(externalId);
                    setPendingExternalId(extId);
                    const m = members.find((u) => u.externalId === extId);
                    setPendingUserName(m?.fullName || 'this user');
                    setConfirmOpen(true);
                  },
                },
              ]}
            />
          </div>
          <DialogConfirm
            open={confirmOpen}
            title="Remove user"
            message={`Remove ${pendingUserName} from this structure?`}
            confirmLabel="Remove"
            cancelLabel="Cancel"
            onCancel={() => {
              setConfirmOpen(false);
              setPendingExternalId(null);
              setPendingUserName('');
            }}
            onConfirm={async () => {
              if (!pendingExternalId) return;
              await removeStructureMember(structureId, pendingExternalId);
              await loadMembers();
              setConfirmOpen(false);
              setPendingExternalId(null);
              setPendingUserName('');
            }}
          />
        </div>
      </PageMain>
    </>
  );
}
