export default async function ExamensPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  // const structure = await getStructureById(id);
  return <div>ExamensPage {id}</div>;
}
