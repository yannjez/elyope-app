import {
  getExamFullDetail,
  searchAnimalsForExamen,
} from '@/components/pages/ExamenController';
import ExamenDetailContent from '@/components/pages/Examen/detail/ExamenDetailContent';
import { ExamenDetailProvider } from '@/components/pages/Examen/detail/ExamenDetailContext';
import { notFound } from 'next/navigation';

export default async function ExamenPage({
  params,
}: {
  params: Promise<{ id: string; structureId: string }>;
}) {
  const { id, structureId } = await params;

  const [examFullDetail, animals] = await Promise.all([
    getExamFullDetail(id, structureId),
    searchAnimalsForExamen(structureId, '', 10),
  ]);

  if (!examFullDetail) {
    return notFound();
  }

  let finalAnimalList = animals;
  if (
    examFullDetail?.animal &&
    !animals?.some(
      (animal) =>
        animal.id === examFullDetail?.animal?.id && animals.length == 10
    )
  ) {
    finalAnimalList = [examFullDetail?.animal, ...animals.slice(0, 9)];
  }

  return (
    <ExamenDetailProvider
      _examen={examFullDetail.exam}
      _animal={examFullDetail.animal}
      _animals={finalAnimalList}
    >
      <ExamenDetailContent />
    </ExamenDetailProvider>
  );
}
