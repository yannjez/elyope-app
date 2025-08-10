import StructureUpsertContent from '@/components/pages/structure/StructureUpsertContent';

export default function StructureEditPage({
  params,
}: {
  params: { id: string };
}) {
  return <StructureUpsertContent mode="edit" id={params.id} />;
}
