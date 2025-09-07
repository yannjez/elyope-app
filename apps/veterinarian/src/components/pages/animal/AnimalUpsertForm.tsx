'use client';

import {
  Button,
  FormField,
  SelectEntity,
  FormPanel,
  FormSeparator,
  Input,
  ZodForm,
  z,
  useFormContext,
  SelectButton,
} from '@app-test2/shared-components';

import { useCallback, useMemo, useState } from 'react';
import {
  createAnimal,
  updateAnimal,
  getAnimalBreeds,
} from './AnimalController';
import { useRouter } from 'next/navigation';
import { AnimalBreedFull, AnimalWithBreed } from '@elyope/db';
import { useTranslations } from 'next-intl';

// Schema will be created inside component to access translations
const createAnimalSchema = (
  nameRequiredMessage: string,
  speciesRequiredMessage: string,
  breedRequiredMessage: string,
  invalidDateMessage: string
) =>
  z.object({
    name: z.string().min(1, nameRequiredMessage),
    species: z.enum(['CHIEN', 'CHAT'], {
      required_error: speciesRequiredMessage,
    }),
    breedId: z.string().min(1, breedRequiredMessage),
    externalRef: z.string().optional(),
    birthDate: z
      .string()
      .optional()
      .refine(
        (date) => {
          if (!date || date === '') return true; // Allow empty/undefined
          const parsedDate = new Date(date);
          return !isNaN(parsedDate.getTime());
        },
        { message: invalidDateMessage }
      ),
    comment: z.string().optional(),
  });

export type AnimalFormData = z.infer<ReturnType<typeof createAnimalSchema>>;

export type AnimalUpsertFormProps = {
  mode: 'create' | 'edit';
  id?: string;
  _animal?: AnimalWithBreed;
  _breeds: AnimalBreedFull[];
  structureId: string;
};

export default function AnimalUpsertForm({
  mode,
  id = '',
  _animal,
  _breeds,
  structureId,
}: AnimalUpsertFormProps) {
  const t = useTranslations('Data.Animal.create');
  const tCommon = useTranslations('Data.Common');
  const tSpecies = useTranslations('Data.Animal.species');
  const router = useRouter();
  const isEdit = mode === 'edit';

  // Create schema with translated validation messages
  const animalSchema = createAnimalSchema(
    t('validation.name_required'),
    t('validation.species_required'),
    t('validation.breed_required'),
    t('validation.invalid_date')
  );

  const [defaults, setDefaults] = useState<AnimalFormData | null>(
    isEdit
      ? {
          name: _animal?.name || '',
          species: (_animal?.species as 'CHIEN' | 'CHAT') || 'CHIEN',
          breedId: _animal?.breedId || '',
          externalRef: _animal?.externalRef || '',
          birthDate: _animal?.birthDate
            ? new Date(_animal?.birthDate)?.toISOString().split('T')[0]
            : undefined,
          comment: _animal?.comment || '',
        }
      : {
          name: '',
          species: 'CHIEN',
          breedId: '',
          externalRef: '',
          birthDate: '',
          comment: '',
        }
  );

  const [availableBreeds, setAvailableBreeds] =
    useState<AnimalBreedFull[]>(_breeds);

  // Filter breeds based on selected species
  const filteredBreeds = useMemo(() => {
    if (!defaults?.species) return [];
    return availableBreeds.filter(
      (breed) => breed.species === defaults.species
    );
  }, [availableBreeds, defaults?.species]);

  const listBreeds = useCallback(
    (keyword?: string) => {
      return filteredBreeds.filter((breed) =>
        breed.name_fr.toLowerCase().includes(keyword?.toLowerCase() || '')
      );
    },
    [filteredBreeds]
  );

  const currentBreed = useMemo(() => {
    if (!defaults?.breedId) return null;
    return (
      filteredBreeds.find((breed) => breed.id === defaults?.breedId) || null
    );
  }, [defaults?.breedId, filteredBreeds]);

  const speciesOptions = [
    { value: 'CHIEN', label: tSpecies('CHIEN') },
    { value: 'CHAT', label: tSpecies('CHAT') },
  ];

  const handleSpeciesChange = async (species: 'CHIEN' | 'CHAT') => {
    setDefaults((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        species,
        breedId: '', // Reset breed when species changes
      };
    });

    // Update available breeds based on new species
    const allBreeds = await getAnimalBreeds();
    setAvailableBreeds(allBreeds.filter((breed) => breed.species === species));
  };

  const handleSubmit = async (data: AnimalFormData) => {
    const dataToSubmit = {
      name: data.name,
      species: data.species,
      breedId: data.breedId,
      structureId,
      externalRef: data.externalRef || null,
      birthDate: data.birthDate ? new Date(data.birthDate) : null,
      comment: data.comment || null,
    };

    if (isEdit) {
      await updateAnimal(id, dataToSubmit);
      router.refresh();
    } else {
      await createAnimal(dataToSubmit);
      router.push(`/${structureId}/animals`);
    }
  };

  return (
    <>
      <FormPanel title={t('form_title')} className="main-container w-full ">
        <ZodForm
          schema={animalSchema}
          onSubmit={handleSubmit}
          defaultValues={defaults || {}}
          className="space-y-2 max-w-4xl"
        >
          <div className="flex flex-col gap-2">
            <FormField name="name" label={t('fields.name.label')} isMandatory>
              <Input placeholder={t('fields.name.placeholder')} />
            </FormField>

            <FormField
              name="species"
              label={t('fields.species.label')}
              isMandatory
            >
              <SelectSpecies
                options={speciesOptions}
                currentSpecies={defaults?.species}
                onSpeciesChange={handleSpeciesChange}
                setDefaults={setDefaults}
                defaults={
                  defaults || { name: '', species: 'CHIEN', breedId: '' }
                }
              />
            </FormField>

            <FormField
              name="breedId"
              label={t('fields.breed.label')}
              isMandatory
            >
              <SelectBreed
                currentBreed={currentBreed}
                setDefaults={setDefaults}
                defaults={
                  defaults || { name: '', species: 'CHIEN', breedId: '' }
                }
                listBreeds={listBreeds}
                filteredBreeds={filteredBreeds}
              />
            </FormField>

            <FormSeparator className="w-full my-4" />

            <FormField name="externalRef" label={t('fields.externalRef.label')}>
              <Input placeholder={t('fields.externalRef.placeholder')} />
            </FormField>

            <FormField name="birthDate" label={t('fields.birthDate.label')}>
              <Input placeholder={t('fields.birthDate.placeholder')} />
            </FormField>

            <FormField name="comment" label={t('fields.comment.label')}>
              <Input placeholder={t('fields.comment.placeholder')} />
            </FormField>

            <FormSeparator className="w-full my-4" />
            <div>
              <Button type="submit" className="button-primary">
                {tCommon('actions.save')}
              </Button>
            </div>
          </div>
        </ZodForm>
      </FormPanel>
    </>
  );
}

function SelectSpecies({
  options,
  currentSpecies,
  onSpeciesChange,
  setDefaults,
  defaults,
}: {
  options: { value: string; label: string }[];
  currentSpecies?: string;
  onSpeciesChange: (species: 'CHIEN' | 'CHAT') => void;
  setDefaults: (defaults: AnimalFormData) => void;
  defaults: AnimalFormData;
}) {
  const form = useFormContext<AnimalFormData>();

  return (
    <SelectButton
      options={options.map((opt) => ({ value: opt.value, label: opt.label }))}
      value={currentSpecies || ''}
      onValueChange={(selectedValue) => {
        const species = selectedValue as 'CHIEN' | 'CHAT';
        setDefaults({
          ...defaults,
          species,
          breedId: '', // Reset breed when species changes
        });
        if (form) {
          form.setValue('species', species);
          form.setValue('breedId', ''); // Reset breed form value too
          form.trigger('species');
        }
        onSpeciesChange(species);
      }}
    />
  );
}

function SelectBreed({
  currentBreed,
  setDefaults,
  defaults,
  listBreeds,
  filteredBreeds,
}: {
  currentBreed: AnimalBreedFull | null;
  setDefaults: (defaults: AnimalFormData) => void;
  defaults: AnimalFormData;
  listBreeds: (keyword?: string) => AnimalBreedFull[];
  filteredBreeds: AnimalBreedFull[];
}) {
  const form = useFormContext<AnimalFormData>();
  const t = useTranslations('Data.Animal.create');

  return (
    <SelectEntity
      className="w-full min-w-0"
      name="breedId"
      maxItems={-1}
      placeholder={t('fields.breed.placeholder')}
      value={currentBreed}
      onChange={(value) => {
        setDefaults({
          ...defaults,
          breedId: value?.id || '',
        });
        if (form) {
          form.setValue('breedId', value?.id || '');
          form.trigger('breedId');
        }
      }}
      getItemLabel={(item) => item.fullname}
      loadInitial={() => Promise.resolve(filteredBreeds)}
      search={(keyword) => Promise.resolve(listBreeds(keyword))}
      disabled={filteredBreeds.length === 0}
    />
  );
}
