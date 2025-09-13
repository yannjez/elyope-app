'use client';

import { Button, ListFilter } from '@app-test2/shared-components';
import { AnimalSpecies } from '@elyope/db';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { useAnimalListContext } from './AnimalListContext';
import { cn } from '@app-test2/shared-components';

export default function AnimalListFilter() {
  const {
    filter,
    isSearching,
    handleKeywordChange,
    handleSpeciesChange,
    handleSearch,
    handleReset,
  } = useAnimalListContext();

  const t = useTranslations('Data.Animal.list');
  const tFilter = useTranslations('Filter');
  const tCommon = useTranslations('Data.Common');
  const tAnimal = useTranslations('Data.Animal');

  // Define options for Animal Species with translations
  const animalSpeciesOptions = [
    { label: tCommon('all'), value: undefined },
    { label: tAnimal('species.CHIEN'), value: 'CHIEN' as AnimalSpecies },
    { label: tAnimal('species.CHAT'), value: 'CHAT' as AnimalSpecies },
  ];

  // Check if filter is empty for reset button state
  const isFilterEmpty = useMemo(() => {
    return !filter.search && !filter.type;
  }, [filter.search, filter.type]);

  return (
    <ListFilter
      filter={{ keyword: filter.search }}
      isFilterEmpty={isFilterEmpty}
      onKeywordChange={handleKeywordChange}
      onSearch={handleSearch}
      onReset={handleReset}
      isSearching={isSearching}
      t={(key: string) => {
        // Try to get translation from filter namespace first, then fallback to general
        try {
          return tFilter(key);
        } catch {
          return key;
        }
      }}
    >
      {/* Species Filter */}
      <div className="flex gap-2 w-full">
        <span className="text-14 whitespace-nowrap ">
          {t('species_filter_label')}
        </span>
        <div className="flex items-center gap-1">
          {animalSpeciesOptions.map((species) => (
            <Button
              key={species.value}
              className={cn(
                `text-xs px-3 py-1 border-none rounded-4 transition-all button-neutral`,
                !species.value && !filter.type && 'button-primary',
                species.value &&
                  filter.type === species.value &&
                  'button-primary'
              )}
              onClick={() =>
                handleSpeciesChange(species.value as AnimalSpecies | undefined)
              }
            >
              {species.label}
            </Button>
          ))}
        </div>
      </div>
    </ListFilter>
  );
}
