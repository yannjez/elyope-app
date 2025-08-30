import { getInterpreters } from '@/components/pages/structure/StructureController';
import { StructureCreateContent } from '@/components/pages/structure/StructureCreateContent';

export default async function NewStructurePage() {
  const interpreters = await getInterpreters();
  return <StructureCreateContent interpreters={interpreters.data} />;
}
