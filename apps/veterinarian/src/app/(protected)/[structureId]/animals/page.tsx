import {
  getAnimalBreeds,
  getInitialAnimals,
} from '@/components/pages/animal/AnimalController';
import AnimalListContent from '@/components/pages/animal/list/AnimalListContent';
import { AnimalListProvider } from '@/components/pages/animal/list/AnimalListContext';

export default async function AnimalsPage() {
  const [breeds, data] = await Promise.all([
    getAnimalBreeds(),
    getInitialAnimals({}),
  ]);
  return (
    <AnimalListProvider
      _breeds={breeds}
      _animals={data.data}
      _pagination={data.pagination}
    >
      <AnimalListContent />
    </AnimalListProvider>
  );
}
