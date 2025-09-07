import {
  getAnimalBreeds,
  getAnimalById,
} from '@/components/pages/animal/AnimalController';
import AnimalDetailContent from '@/components/pages/animal/detail/AnimalDetailContent';
import { AnimalDetailProvider } from '@/components/pages/animal/detail/AnimalDetailContext';
import { notFound } from 'next/navigation';

export default async function AnimalPage({
  params,
}: {
  params: Promise<{ animalId: string; structureId: string }>;
}) {
  const { animalId, structureId } = await params;

  const [breeds, animal] = await Promise.all([
    getAnimalBreeds(),
    getAnimalById(animalId, structureId),
  ]);

  if (!animal) {
    return notFound();
  }

  return (
    <AnimalDetailProvider _animal={animal} _breeds={breeds}>
      <AnimalDetailContent />
    </AnimalDetailProvider>
  );
}
