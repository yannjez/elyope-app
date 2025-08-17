import StructureListContent from '@/components/pages/structure/StructureListContent';
import { StructureListProvider } from '@/components/pages/structure/StructureListContext';
import { getStructureList } from '@/components/pages/structure/StructureController';
import { Structure } from '@elyope/db';

export default async function StructurePage() {
  const { data, pagination } = await getStructureList();
  return (
    <StructureListProvider _data={data as Structure[]} _pagination={pagination}>
      <StructureListContent />
    </StructureListProvider>
  );
}
