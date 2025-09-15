'use client';

import { useTranslations } from 'next-intl';
import { useExamenDetailContext } from './ExamenDetailContext';
import { useAppContext } from '@/components/layouts/AppContext';
import Link from 'next/link';

export default function AnimalInfoPanel() {
  const { currentAnimal } = useExamenDetailContext();
  const { currentStructure } = useAppContext();
  const t = useTranslations('Data.Animal');
  const tCommon = useTranslations('Data.Common');

  if (!currentAnimal) {
    return (
      <div className="text-gray-500 text-sm">{t('no_animal_selected')}</div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="border-t py-3 border-gray-200  space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">{t('fields.name')}:</span>
          <span className="font-medium">{currentAnimal.name}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">{t('fields.species')}:</span>
          <span className="font-medium">
            {currentAnimal.species === 'CHIEN' ? 'Chien' : 'Chat'}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">{t('fields.breed')}:</span>
          <span className="font-medium">
            {currentAnimal.breed?.name_fr || currentAnimal.fullBreed}
          </span>
        </div>

        {currentAnimal.birthDate && (
          <div className="flex justify-between">
            <span className="text-gray-600">{t('fields.birthDate')}:</span>
            <span className="font-medium">
              {new Date(currentAnimal.birthDate).toLocaleDateString('fr-FR')}
            </span>
          </div>
        )}

        {currentAnimal.externalRef && (
          <div className="flex justify-between">
            <span className="text-gray-600">{t('fields.externalRef')}:</span>
            <span className="font-medium">{currentAnimal.externalRef}</span>
          </div>
        )}
      </div>

      <div className="py-3 border-t border-gray-200">
        <Link
          href={`/${currentStructure?.id}/animals/${currentAnimal.id}`}
          className="button-primary"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          → {tCommon('actions.view_details')}
        </Link>
      </div>
    </div>
  );
}
