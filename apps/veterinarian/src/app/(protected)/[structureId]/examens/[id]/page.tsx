import { getExamFullDetail } from '@/components/pages/ExamenController';
import ExamenDetailContent from '@/components/pages/Examen/detail/ExamenDetailContent';
import { ExamenDetailProvider } from '@/components/pages/Examen/detail/ExamenDetailContext';
import { notFound } from 'next/navigation';

export default async function ExamenPage({
  params,
}: {
  params: Promise<{ id: string; structureId: string }>;
}) {
  const { id, structureId } = await params;

  const examFullDetail = await getExamFullDetail(id, structureId);

  if (!examFullDetail) {
    return notFound();
  }

  return (
    <ExamenDetailProvider _examen={examFullDetail.exam}>
      <ExamenDetailContent />
    </ExamenDetailProvider>
  );
}
