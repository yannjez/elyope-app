import { StructureEditContent } from '@/components/pages/structure/StructureEditContent';

export default function StructureEditPage({
  params,
}: {
  params: { id: string };
}) {
  return <StructureEditContent structureId={params.id} />;
}
