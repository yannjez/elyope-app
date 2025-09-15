'use client';

import {
  PageHeader,
  BriefCaseIcon,
  DataGrid,
  Pagination,
  PencilIcon,
  TrashIcon,
  PageMain,
  DataGridColumn,
} from '@app-test2/shared-components';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { DialogConfirm } from '@app-test2/shared-components';
import { deleteStructure } from './StructureController';
import {
  StructureFilter,
  useStructureListControllerContext,
} from './StructureListContext';
import { StructureListFilter } from './StructureListFilter';
import { Structure } from '@elyope/db';
import { useTranslations } from 'next-intl';

export default function StructureListContent() {
  const t = useTranslations('Data.Structure.list');
  const tCommon = useTranslations('Data.Common');
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const {
    data,
    pagination,
    currentPage,
    filter,
    sortState,
    isSearching,
    handlePageChange,
    handleKeywordChange,
    handleSearch,
    handleSort,
    handleReset,
  } = useStructureListControllerContext();

  const isFilterEmpty = !filter.keyword;

  const columns = [
    {
      header: t('columns.name'),
      field: 'name' as const,
      isSortable: true,
      className: 'font-medium',
    },
    { header: t('columns.town'), field: 'town' as const, isSortable: true },
    {
      header: t('columns.zipcode'),
      field: 'zipcode' as const,
      isSortable: true,
    },
    {
      header: t('columns.state'),
      field: 'state' as const,
      className: '!p-0',
      displayCell: (row: Structure) => {
        const stateKey = row.is_structure_active ? 'active' : 'inactive';
        const stateClassName: Record<'active' | 'inactive', [string, string]> =
          {
            active: ['bg-el-green-300', 'bg-el-green-500'],
            inactive: ['bg-el-red-200', 'bg-el-red-500'],
          };
        return (
          <div className={`px-3 py-2 rounded-4 ${stateClassName[stateKey][0]}`}>
            <div className="flex items-center gap-2">
              <div
                className={`w-2.5 h-2.5 rounded-full ${stateClassName[stateKey][1]}`}
              />
              <span>
                {stateKey === 'active'
                  ? tCommon('status.active')
                  : tCommon('status.inactive')}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      header: t('columns.created'),
      field: 'createdAt' as const,
      isSortable: true,
      displayCell: (row: Structure) => (
        <span className="text-sm text-el-gray-500">
          {row.createdAt ? new Date(row.createdAt).toLocaleDateString() : ''}
        </span>
      ),
    },
  ];

  // Translation function for filters - using common translations
  const tFilter = (key: string) => tCommon(key);

  return (
    <>
      <PageHeader
        title={t('title')}
        icon={<BriefCaseIcon className="w-full" />}
        action={
          <Link
            href="/structures/create-structure"
            className="button-primary min-w-40"
          >
            {t('create_button')}
          </Link>
        }
        filters={
          <StructureListFilter
            filter={filter as StructureFilter}
            onKeywordChange={handleKeywordChange}
            onSearch={handleSearch}
            onReset={handleReset}
            isSearching={isSearching}
            isFilterEmpty={isFilterEmpty}
            t={tFilter}
          />
        }
      />
      <PageMain className="p-0">
        <div className="flex items-center justify-between mt-4">
          <div className="flex-1" />
          <Pagination
            currentPage={currentPage}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        </div>

        <div className="mt-2">
          <DataGrid
            columns={columns as DataGridColumn<Structure>[]}
            data={data as Structure[]}
            className="rounded-4 w-full"
            skeletonRowClass="!p-3"
            onSort={
              handleSort as (field: string, direction: 'asc' | 'desc') => void
            }
            sortField={(sortState.field as keyof Structure) ?? undefined}
            sortDirection={sortState.direction}
            noDataMessage={t('no_data')}
            isLoading={isSearching}
            loadingRows={5}
            rowActions={[
              {
                name: t('actions.edit'),
                icon: <PencilIcon className="w-full h-full" />,
                onClick: (id: string | undefined) => {
                  if (id) router.push(`/structures/${id}`);
                },
                propertyKey: 'id',
              },
              {
                className: 'hover:text-el-red-500',
                name: t('actions.delete'),

                icon: <TrashIcon className="w-full h-full" />,
                onClick: (id: string | undefined) => {
                  if (id) {
                    setSelectedId(id);
                    setConfirmOpen(true);
                  }
                },
              },
            ]}
          />
          <DialogConfirm
            open={confirmOpen}
            title={t('dialog.delete_title')}
            message={t('dialog.delete_message')}
            confirmLabel={t('actions.delete')}
            cancelLabel={tCommon('actions.cancel')}
            confirmClassName="button-destructive"
            disableCancel={false}
            onCancel={() => {
              setConfirmOpen(false);
              setSelectedId(null);
            }}
            onConfirm={async () => {
              if (selectedId) {
                await deleteStructure(selectedId);
                // Trigger a refresh by re-searching current page
                handleSearch();
              }
              setConfirmOpen(false);
              setSelectedId(null);
            }}
          />
        </div>
      </PageMain>
    </>
  );
}
