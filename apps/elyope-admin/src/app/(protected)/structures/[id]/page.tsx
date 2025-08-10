import { StructureEditContent } from '@/components/pages/structure/StructureEditContent';

export default async function StructureEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <StructureEditContent structureId={id} />;
}
