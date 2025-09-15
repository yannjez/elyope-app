import {
  getAnimalBreeds,
  getInitialAnimals,
} from '@/components/pages/animal/AnimalController';
import AnimalListContent from '@/components/pages/animal/list/AnimalListContent';
import { AnimalListProvider } from '@/components/pages/animal/list/AnimalListContext';

export default async function AnimalsPage({
  params,
}: {
  params: Promise<{ structureId: string }>;
}) {
  const { structureId } = await params;

  const [breeds, data] = await Promise.all([
    getAnimalBreeds(),
    getInitialAnimals({ structureId }),
  ]);
  return (
    <AnimalListProvider
      _breeds={breeds}
      _animals={data.data}
      _pagination={data.pagination}
      structureId={structureId}
    >
      <AnimalListContent />
    </AnimalListProvider>
  );
}
