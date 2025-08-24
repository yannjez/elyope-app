import { BriefCaseIcon, PageHeader } from '@app-test2/shared-components';
import Form from './StructureUpsertContent';
import Link from 'next/link';
import { FullUser } from '@elyope/db';

export function StructureCreateContent({
  interpreters,
}: {
  interpreters: FullUser[];
}) {
  return (
    <>
      <PageHeader
        title={'Create Structure'}
        icon={<BriefCaseIcon className="w-full" />}
        action={
          <Link href="/structures" className="button-primary-inverse min-w-40">
            ← Back to list
          </Link>
        }
      />
      <Form mode="create" _interpreters={interpreters} />
    </>
  );
}
