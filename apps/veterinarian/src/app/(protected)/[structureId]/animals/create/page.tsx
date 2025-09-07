import { getAnimalBreeds } from '@/components/pages/animal/AnimalController';
import AnimalCreateContent from '@/components/pages/animal/detail/AnimalCreateContent';
import { AnimalDetailProvider } from '@/components/pages/animal/detail/AnimalDetailContext';

export default async function CreateAnimalPage() {
  const breeds = await getAnimalBreeds();

  return (
    <AnimalDetailProvider _breeds={breeds}>
      <AnimalCreateContent />
    </AnimalDetailProvider>
  );
}
