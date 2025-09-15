'use client';

import {
  AnimauxIcon,
  PageHeader,
  PageMain,
} from '@app-test2/shared-components';
import AnimalUpsertForm from '../AnimalUpsertForm';
import { useAnimalDetailContext } from './AnimalDetailContext';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useAppContext } from '@/components/layouts/AppContext';

export default function AnimalDetailContent() {
  const { animal, breeds } = useAnimalDetailContext();
  const { currentStructure } = useAppContext();
  const t = useTranslations('Data.Animal.detail');

  return (
    <>
      <PageHeader
        title={t('title')}
        icon={<AnimauxIcon className="w-full" />}
        action={
          <Link
            href={`/${currentStructure?.id}/animals`}
            className="button-primary-inverse min-w-40"
          >
            ← {t('back_to_list')}
          </Link>
        }
      />
      <PageMain className="p-0">
        <AnimalUpsertForm
          mode="edit"
          id={animal?.id}
          _animal={animal}
          _breeds={breeds}
          structureId={currentStructure?.id || ''}
        />
      </PageMain>
    </>
  );
}
