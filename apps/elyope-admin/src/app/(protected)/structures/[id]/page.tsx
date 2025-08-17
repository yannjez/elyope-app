import {
  getInterpreters,
  getStructureById,
  getStructureMembers,
} from '@/components/pages/structure/StructureController';
import { StructureEditContent } from '@/components/pages/structure/StructureEditContent';
import { Structure } from '@elyope/db';

export default async function StructureEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const members = await getStructureMembers(id);
  const structure = await getStructureById(id);
  const interpreters = await getInterpreters();

  return (
    <StructureEditContent
      structureId={id}
      _members={members}
      _structure={structure as Structure}
      _interpreters={interpreters.data}
    />
  );
}
