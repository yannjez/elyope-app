import { BriefCaseIcon, PageHeader } from '@app-test2/shared-components';
import Form from './StructureUpsertContent';
import Link from 'next/link';
import { FullUser } from '@elyope/db';
import { useTranslations } from 'next-intl';

export function StructureCreateContent({
  interpreters,
}: {
  interpreters: FullUser[];
}) {
  const t = useTranslations('Data.Structure.create');
  const tCommon = useTranslations('Data.Common');

  return (
    <>
      <PageHeader
        title={t('title')}
        icon={<BriefCaseIcon className="w-full" />}
        action={
          <Link href="/structures" className="button-primary-inverse min-w-40">
            {tCommon('navigation.back_to_list')}
          </Link>
        }
      />
      <Form mode="create" _interpreters={interpreters} />
    </>
  );
}
