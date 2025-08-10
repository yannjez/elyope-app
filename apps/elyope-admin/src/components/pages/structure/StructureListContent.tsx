'use client';

import {
  PageHeader,
  BriefCaseIcon,
  DataGrid,
  Pagination,
  PencilIcon,
  TrashIcon,
} from '@app-test2/shared-components';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { DialogConfirm } from '@app-test2/shared-components';
import { deleteStructure } from './StructureListController';
import { useStructureListControllerContext } from './StructureListContext';
import { StructureListFilter } from './StructureListFilter';

export default function StructureListContent() {
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
      header: 'Name',
      field: 'name' as const,
      isSortable: true,
      className: 'font-medium',
    },
    { header: 'Town', field: 'town' as const, isSortable: true },
    { header: 'Zipcode', field: 'zipcode' as const, isSortable: true },
    {
      header: 'Created',
      field: 'createdAt' as const,
      isSortable: true,
      displayCell: (row: any) => (
        <span className="text-sm text-el-gray-500">
          {row.createdAt ? new Date(row.createdAt).toLocaleDateString() : ''}
        </span>
      ),
    },
  ];

  const t = (key: string) => {
    const translations: Record<string, string> = {
      filter: 'Filter your data',
      search: 'Search',
      reset: 'Reset search',
    };
    return translations[key] || key;
  };

  return (
    <>
      <PageHeader
        title="Structures"
        icon={<BriefCaseIcon className="w-full" />}
        action={
          <Link
            href="/structures/create-structure"
            className="button-primary min-w-40"
          >
            + Create Structure
          </Link>
        }
        filters={
          <StructureListFilter
            filter={filter as any}
            onKeywordChange={handleKeywordChange}
            onSearch={handleSearch}
            onReset={handleReset}
            isSearching={isSearching}
            isFilterEmpty={isFilterEmpty}
            t={t}
          />
        }
      />
      <main className="main-container">
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
            columns={columns as any}
            data={data as any}
            className="rounded-4 w-full"
            skeletonRowClass="!p-3"
            onSort={handleSort as any}
            sortField={(sortState.field as any) ?? undefined}
            sortDirection={sortState.direction}
            noDataMessage="No structures found"
            isLoading={isSearching}
            loadingRows={5}
            rowActions={[
              {
                name: 'Edit',
                icon: <PencilIcon className="w-full h-full" />,
                onClick: (id: string) => router.push(`/structures/${id}`),
              },
              {
                className: 'hover:text-el-red-500',
                name: 'Delete',
                icon: <TrashIcon className="w-full h-full" />,
                onClick: (id: string) => {
                  setSelectedId(String(id));
                  setConfirmOpen(true);
                },
              },
            ]}
          />
          <DialogConfirm
            open={confirmOpen}
            title="Delete structure"
            message="Are you sure you want to delete this structure? This action cannot be undone."
            confirmLabel="Delete"
            cancelLabel="Cancel"
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
      </main>
    </>
  );
}
