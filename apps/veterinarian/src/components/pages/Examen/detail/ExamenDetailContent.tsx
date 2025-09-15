'use client';

import { Examens, PageHeader, PageMain } from '@app-test2/shared-components';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useAppContext } from '@/components/layouts/AppContext';
import ExamenForm from './ExamenForm';

export default function ExamenDetailContent() {
  const { currentStructure } = useAppContext();
  const t = useTranslations('Data.Examen.detail');

  return (
    <>
      <PageHeader
        title={t('title')}
        icon={<Examens className="w-full" />}
        action={
          <Link
            href={`/${currentStructure?.id}/examens`}
            className="button-primary-inverse min-w-40"
          >
            {t('back_to_list')}
          </Link>
        }
      />
      <PageMain className="p-0">
        <div className="flex gap-2.5 ">
          <div className="w-2/3 bg-white rounded-4  overflow-y-auto">
            <ExamenForm />
          </div>
          <div className="flex flex-col gap-2.5 w-1/3">
            <div className="bg-white rounded-4 p-3">Interpretation</div>
            <div className="bg-white rounded-4 p-3">Message</div>
            <div className="bg-white rounded-4 p-3">Animal</div>
          </div>
        </div>
      </PageMain>
    </>
  );
}
