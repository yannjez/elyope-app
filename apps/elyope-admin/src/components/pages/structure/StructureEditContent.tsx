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
import { useTranslations } from 'next-intl';

type StructureEditContentProps = {
  structureId: string;
  _members: FullUser[];
  _structure: Structure;
  _interpreters: FullUser[];
};

export function StructureEditContent(props: StructureEditContentProps) {
  const t = useTranslations('Data.Structure.edit');
  const tCommon = useTranslations('Data.Common');
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
      {
        header: t('users_panel.columns.name'),
        field: 'fullName' as const,
        isSortable: true,
      },
      {
        header: tCommon('fields.email'),
        field: 'email' as const,
        isSortable: true,
      },
    ],
    [t, tCommon]
  );

  return (
    <>
      <PageHeader
        title={t('title')}
        icon={<BriefCaseIcon className="w-full" />}
        action={
          <Link href="/structures" className="button-primary-inverse">
            ← {tCommon('navigation.back_to_list')}
          </Link>
        }
      />
      <PageMain className="flex flex-col lg:flex-row gap-3 p-0 min-h-0">
        <div className="w-full lg:w-1/2">
          <Form
            mode="edit"
            id={structureId}
            _structure={_structure}
            _interpreters={_interpreters}
          />
        </div>
        <div className="w-full lg:w-1/2 flex flex-col gap-3">
          <StructureUsersPanel
            structureId={structureId}
            onUserAdded={loadMembers}
          />
          <div className="bg-white rounded-4 h-full p-2 min-h-0 overflow-hidden">
            <PanelTitle title={t('users_panel.title')} />
            <div className="overflow-auto">
              <DataGrid
                blueMode={true}
                className="text-12"
                columns={columns}
                data={(members || []).map((m) => ({ ...m }))}
                isLoading={isLoading}
                loadingRows={4}
                noDataMessage={t('users_panel.no_data')}
                rowActions={[
                  {
                    name: t('users_panel.actions.remove'),
                    className: 'hover:text-el-red-500',
                    icon: <TrashIcon className="h-3/4 w-auto" />,
                    propertyKey: 'externalId',
                    onClick: (externalId) => {
                      const extId = String(externalId);
                      setPendingExternalId(extId);
                      const m = members.find((u) => u.externalId === extId);
                      setPendingUserName(
                        m?.fullName || t('users_panel.fallback.unknown_user')
                      );
                      setConfirmOpen(true);
                    },
                  },
                ]}
              />
            </div>
          </div>
          <DialogConfirm
            open={confirmOpen}
            title={t('users_panel.dialog.remove_title')}
            message={t('users_panel.dialog.remove_message', {
              name: pendingUserName,
            })}
            confirmLabel={tCommon('actions.remove')}
            cancelLabel={tCommon('actions.cancel')}
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
