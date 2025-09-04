'use client';

import {
  AnimauxIcon,
  DataGrid,
  DataGridColumn,
  DialogConfirm,
  PageHeader,
  PageMain,
  Pagination,
  PencilIcon,
  TrashIcon,
} from '@app-test2/shared-components';
import { Animal, AnimalGrid } from '@elyope/db';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useAnimalListContext } from './AnimalListContext';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAppContext } from '@/components/layouts/AppContext';

const columns: DataGridColumn<AnimalGrid & { 'breed.name_fr': string }>[] = [
  {
    header: 'Name',
    field: 'name',
    isSortable: true,
  },
  {
    header: 'Breed',
    field: 'breed.name_fr',
    isSortable: true,
  },
  {
    header: 'Birth Date',
    field: 'birthDate',
    isSortable: true,
    displayCell: (row) => row.birthDate?.toLocaleDateString(),
  },
  {
    header: 'Comment',
    field: 'comment',
  },
];

export default function AnimalListContent() {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const tCommon = useTranslations('Data.Common');
  const { locale } = useAppContext();

  const {
    animals,
    pagination,
    currentPage,
    handlePageChange,
    isSearching,
    sortState,
    handleSort,
    handleSearch,
  } = useAnimalListContext();

  const router = useRouter();

  const t = useTranslations('Data.Animal.list');
  return (
    <>
      <PageHeader
        title={t('title') + ' ' + locale}
        icon={<AnimauxIcon className="w-full" />}
        action={
          <Link
            href="/structures/create-structure"
            className="button-primary min-w-40"
          >
            {t('create_button')}
          </Link>
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
            columns={columns as DataGridColumn<Animal>[]}
            data={animals as Animal[]}
            className="rounded-4 w-full"
            skeletonRowClass="!p-3"
            onSort={
              handleSort as (
                field: keyof Animal,
                direction: 'asc' | 'desc'
              ) => void
            }
            sortField={(sortState.field as keyof Animal) ?? undefined}
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
            onCancel={() => {
              setConfirmOpen(false);
              setSelectedId(null);
            }}
            onConfirm={async () => {
              if (selectedId) {
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
