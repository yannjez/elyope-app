'use client';

import { Examens, PageHeader, PageMain } from '@app-test2/shared-components';
import { useExamenDetailContext } from './ExamenDetailContext';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useAppContext } from '@/components/layouts/AppContext';

export default function ExamenDetailContent() {
  const { examen } = useExamenDetailContext();
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
            ← {t('back_to_list')}
          </Link>
        }
      />
      <PageMain className="p-6">
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">{t('information')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ID
                </label>
                <p className="text-sm text-gray-900 font-mono bg-gray-50 p-2 rounded">
                  {examen?.id || 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </PageMain>
    </>
  );
}
