import { getInitialExams } from '@/components/pages/ExamenController';
import ExamenContent from '@/components/pages/Examen/list/ExamenListContent';
import { ExamenControllerProvider } from '@/components/pages/Examen/list/ExamenListContext';

export default async function ExamensPage({
  params,
}: {
  params: Promise<{ structureId: string }>;
}) {
  const { structureId } = await params;

  const data = await getInitialExams({ structureId });

  return (
    <ExamenControllerProvider
      _exams={data.data}
      _pagination={data.pagination}
      structureId={structureId}
    >
      <ExamenContent />
    </ExamenControllerProvider>
  );
}
