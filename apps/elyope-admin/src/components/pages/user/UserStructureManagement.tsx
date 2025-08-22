'use client';

import React, { useState, useMemo } from 'react';
import { Structure } from '@elyope/db';
import {
  Button,
  PanelTitle,
  z,
  ZodForm,
  SelectEntity,
  useFormContext,
} from '@app-test2/shared-components';
import { useUserDetail } from './UserDetailContext';
import { addToAStructure } from './UserDetailController';

import { useRouter } from 'next/navigation';

type UserStructureManagementProps = {
  onStructureChange?: () => void;
};

const addToStructureSchema = z.object({
  structutreToAddId: z.string().min(2, 'Id is required'),
});

export function UserStructureManagement({
  onStructureChange,
}: UserStructureManagementProps) {
  const router = useRouter();

  const { currentUser, userStructures, allStructures } = useUserDetail();

  const [selectedStructureId, setSelectedStructureId] = useState<string>('');

  const handleAddToStructure = async () => {
    console.log('selectedStructureId', selectedStructureId);
    if (!selectedStructureId) return;

    try {
      if (!currentUser) return;

      await addToAStructure({
        userId: currentUser.id,
        structureId: selectedStructureId,
      });

      // Reload data to reflect changes
      setSelectedStructureId('');
      onStructureChange?.();
      router.refresh();
    } catch (error) {
      console.error('Error adding user to structure:', error);
    }
  };

  // Filter out structures the user is already part of
  const availableStructures = useMemo(
    () =>
      allStructures?.length > 0
        ? allStructures?.filter(
            (structure) =>
              !userStructures.some(
                (userStructure) => userStructure.id === structure.id
              )
          )
        : [],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [allStructures, userStructures]
  );

  return (
    <>
      <PanelTitle title="Structure Management" />
      <ZodForm
        id={'structure-add-' + currentUser?.id}
        schema={addToStructureSchema}
        onSubmit={async () => {
          if (selectedStructureId && currentUser?.id) {
            await addToAStructure({
              userId: currentUser.id,
              structureId: selectedStructureId,
            });

            onStructureChange?.();
          }
        }}
      >
        <div className="flex  gap-2 items-center">
          <SelectStructure
            availableStructures={availableStructures}
            setSelectedStructureId={setSelectedStructureId}
          />
          {/* Add to Structure Section */}

          <Button
            className="button button-primary whitespace-nowrap"
            onClick={handleAddToStructure}
            disabled={
              !selectedStructureId ||
              !currentUser?.roles.includes('VETERINARIAN')
            }
          >
            + Add
          </Button>
        </div>
        <div className="text-el-grey-500 text-12 mt-2">
          Ps: the user can only be added to structure if he has the VETERINARIAN
          role
        </div>
      </ZodForm>
    </>
  );
}

type SelectStructureProps = {
  availableStructures: Structure[];
  setSelectedStructureId: (id: string) => void;
};

function SelectStructure({
  availableStructures,
  setSelectedStructureId,
}: SelectStructureProps) {
  const form = useFormContext<{ structutreToAddId: string }>();
  return (
    <SelectEntity
      value={null as unknown as Structure}
      onChange={function (value: Structure | null): void {
        console.log('value', value);
        setSelectedStructureId(value?.id || '');
        if (form) {
          form.setValue('structutreToAddId', value?.id || '');
          form.trigger('structutreToAddId');
        }
      }}
      renderItem={(item) => {
        return <span>{item.name}</span>;
      }}
      getItemLabel={(item) => item.name}
      getItemId={(item) => item.id}
      className="w-full"
      name="structutreToAddId"
      placeholder="Select a structure"
      loadInitial={function (): Promise<Structure[]> {
        return Promise.resolve(availableStructures);
      }}
      search={function (query: string): Promise<Structure[]> {
        return Promise.resolve(
          availableStructures.filter((structure) =>
            structure.name.toLowerCase().includes(query.toLowerCase())
          )
        );
      }}
    />
  );
}
