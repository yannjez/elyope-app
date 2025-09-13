'use client';

import { AnimalFull, ExamWithRelations, ExamStatusType } from '@elyope/db';
import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/components/layouts/AppContext';
import { updateExam, searchAnimalsForExamen } from '../../ExamenController';
import { z } from '@app-test2/shared-components';

// Schema for examen form validation
const createExamenSchema = (
  statusRequiredMessage: string,
  dateRequiredMessage: string,
  invalidDateMessage: string,
  animalRequiredMessage: string
) =>
  z.object({
    status: z.enum(
      ['PENDING', 'PROCESSING', 'COMPLETED', 'ARCHIVED', 'CANCELLED'],
      {
        required_error: statusRequiredMessage,
      }
    ),
    requestedAt: z
      .string()
      .min(1, dateRequiredMessage)
      .refine(
        (date) => {
          const parsedDate = new Date(date);
          return !isNaN(parsedDate.getTime());
        },
        { message: invalidDateMessage }
      ),
    animalId: z.string().min(1, animalRequiredMessage),
    vetReference: z.string().optional(),
    requestReason: z.string().optional(),
    history: z.string().optional(),
    clinicalExams: z.string().optional(),
    manifestationCategory: z.string().optional(),
    paroxysmalSubtype: z.string().optional(),
    manifestationOther: z.string().optional(),
    firstManifestationAt: z
      .string()
      .optional()
      .refine(
        (date) => {
          if (!date || date === '') return true;
          const parsedDate = new Date(date);
          return !isNaN(parsedDate.getTime());
        },
        { message: invalidDateMessage }
      ),
    lastManifestationAt: z
      .string()
      .optional()
      .refine(
        (date) => {
          if (!date || date === '') return true;
          const parsedDate = new Date(date);
          return !isNaN(parsedDate.getTime());
        },
        { message: invalidDateMessage }
      ),
    manifestationDescription: z.string().optional(),
    manifestationFrequency: z.string().optional(),
    avgManifestationDurationMin: z
      .string()
      .optional()
      .refine(
        (val) => {
          if (!val || val === '') return true;
          const num = parseInt(val);
          return !isNaN(num) && num >= 0;
        },
        { message: 'Duration must be a positive number' }
      ),
    clinicalSuspicion: z.string().optional(),
    currentAntiepilepticTreatments: z.string().optional(),
    otherTreatments: z.string().optional(),
    examCondition: z.string().optional(),
    sedationProtocol: z.string().optional(),
    eegSpecificEvents: z.string().optional(),
    duringExamClinical: z.string().optional(),
    comments: z.string().optional(),
  });

export type ExamenFormData = z.infer<ReturnType<typeof createExamenSchema>>;

type ExamenDetailContextType = {
  examen?: ExamWithRelations;
  animal?: AnimalFull;
  animals?: AnimalFull[];
  // Form-related properties
  schema: ReturnType<typeof createExamenSchema>;
  defaults: ExamenFormData | null;
  currentAnimal: AnimalFull | null;
  // Options for select fields
  statusOptions: { value: ExamStatusType; label: string }[];
  manifestationCategoryOptions: { value: string; label: string }[];
  paroxysmalSubtypeOptions: { value: string; label: string }[];
  manifestationFrequencyOptions: { value: string; label: string }[];
  // Functions
  searchAnimals: (keyword: string) => Promise<AnimalFull[]>;
  handleSubmit: (data: ExamenFormData) => Promise<void>;
  setDefaults: (defaults: ExamenFormData) => void;
};

const ExamenDetailContext = createContext<ExamenDetailContextType | undefined>(
  undefined
);

type ExamenDetailProviderProps = {
  children: React.ReactNode;
  _examen?: ExamWithRelations;
  _animal?: AnimalFull;
  _animals?: AnimalFull[];
};

export const ExamenDetailProvider = ({
  children,
  _examen,
  _animal,
  _animals,
}: ExamenDetailProviderProps) => {
  const { currentStructure } = useAppContext();
  const t = useTranslations('Data.Examen.edit');
  const tStatus = useTranslations('Data.Examen.status');
  const router = useRouter();

  // Create schema with translated validation messages
  const schema = createExamenSchema(
    t('validation.status_required'),
    t('validation.date_required'),
    t('validation.invalid_date'),
    t('validation.animal_required')
  );

  // Form defaults state
  const [defaults, setDefaults] = useState<ExamenFormData | null>(
    _examen
      ? {
          status: _examen.status as ExamStatusType,
          requestedAt: _examen.requestedAt
            ? new Date(_examen.requestedAt).toISOString().split('T')[0]
            : '',
          animalId: _examen.animalId || '',
          vetReference: _examen.vetReference || '',
          requestReason: _examen.requestReason || '',
          history: _examen.history || '',
          clinicalExams: _examen.clinicalExams || '',
          manifestationCategory: _examen.manifestationCategory || '',
          paroxysmalSubtype: _examen.paroxysmalSubtype || '',
          manifestationOther: _examen.manifestationOther || '',
          firstManifestationAt: _examen.firstManifestationAt
            ? new Date(_examen.firstManifestationAt).toISOString().split('T')[0]
            : '',
          lastManifestationAt: _examen.lastManifestationAt
            ? new Date(_examen.lastManifestationAt).toISOString().split('T')[0]
            : '',
          manifestationDescription: _examen.manifestationDescription || '',
          manifestationFrequency: _examen.manifestationFrequency || '',
          avgManifestationDurationMin:
            _examen.avgManifestationDurationMin?.toString() || '',
          clinicalSuspicion: _examen.clinicalSuspicion || '',
          currentAntiepilepticTreatments:
            _examen.currentAntiepilepticTreatments || '',
          otherTreatments: _examen.otherTreatments || '',
          examCondition: _examen.examCondition || '',
          sedationProtocol: _examen.sedationProtocol || '',
          eegSpecificEvents: _examen.eegSpecificEvents || '',
          duringExamClinical: _examen.duringExamClinical || '',
          comments: _examen.comments || '',
        }
      : null
  );

  // Current animal based on selected animalId
  const currentAnimal = useMemo(() => {
    if (!defaults?.animalId || !_animals) return null;
    return _animals.find((animal) => animal.id === defaults?.animalId) || null;
  }, [defaults?.animalId, _animals]);

  // Select options
  const statusOptions = useMemo(
    () => [
      { value: 'PENDING' as ExamStatusType, label: tStatus('PENDING') },
      { value: 'PROCESSING' as ExamStatusType, label: tStatus('PROCESSING') },
      { value: 'COMPLETED' as ExamStatusType, label: tStatus('COMPLETED') },
      { value: 'ARCHIVED' as ExamStatusType, label: tStatus('ARCHIVED') },
      { value: 'CANCELLED' as ExamStatusType, label: tStatus('CANCELLED') },
    ],
    [tStatus]
  );

  const manifestationCategoryOptions = useMemo(
    () => [
      {
        value: 'paroxysmal',
        label: t('fields.manifestationCategory.options.paroxysmal'),
      },
      {
        value: 'vigilance',
        label: t('fields.manifestationCategory.options.vigilance'),
      },
      {
        value: 'behavior',
        label: t('fields.manifestationCategory.options.behavior'),
      },
      {
        value: 'other',
        label: t('fields.manifestationCategory.options.other'),
      },
    ],
    [t]
  );

  const paroxysmalSubtypeOptions = useMemo(
    () => [
      {
        value: 'isolated',
        label: t('fields.paroxysmalSubtype.options.isolated'),
      },
      {
        value: 'grouped',
        label: t('fields.paroxysmalSubtype.options.grouped'),
      },
      {
        value: 'status_epilepticus',
        label: t('fields.paroxysmalSubtype.options.status_epilepticus'),
      },
    ],
    [t]
  );

  const manifestationFrequencyOptions = useMemo(
    () => [
      {
        value: 'daily',
        label: t('fields.manifestationFrequency.options.daily'),
      },
      {
        value: 'weekly',
        label: t('fields.manifestationFrequency.options.weekly'),
      },
      {
        value: 'monthly',
        label: t('fields.manifestationFrequency.options.monthly'),
      },
      {
        value: 'occasional',
        label: t('fields.manifestationFrequency.options.occasional'),
      },
    ],
    [t]
  );

  // Search animals function
  const searchAnimals = useCallback(
    async (keyword: string) => {
      if (!currentStructure?.id) return [];
      const animals = await searchAnimalsForExamen(
        currentStructure.id,
        keyword,
        10
      );
      return animals;
    },
    [currentStructure?.id]
  );

  // Form submission handler
  const handleSubmit = useCallback(
    async (data: ExamenFormData) => {
      if (!_examen) return;

      const dataToSubmit = {
        status: data.status as ExamStatusType,
        requestedAt: new Date(data.requestedAt),
        animalId: data.animalId,
        vetReference: data.vetReference || undefined,
        requestReason: data.requestReason || undefined,
        history: data.history || undefined,
        clinicalExams: data.clinicalExams || undefined,
        manifestationCategory: data.manifestationCategory || undefined,
        paroxysmalSubtype: data.paroxysmalSubtype || undefined,
        manifestationOther: data.manifestationOther || undefined,
        firstManifestationAt: data.firstManifestationAt
          ? new Date(data.firstManifestationAt)
          : undefined,
        lastManifestationAt: data.lastManifestationAt
          ? new Date(data.lastManifestationAt)
          : undefined,
        manifestationDescription: data.manifestationDescription || undefined,
        manifestationFrequency: data.manifestationFrequency || undefined,
        avgManifestationDurationMin: data.avgManifestationDurationMin
          ? parseInt(data.avgManifestationDurationMin)
          : undefined,
        clinicalSuspicion: data.clinicalSuspicion || undefined,
        currentAntiepilepticTreatments:
          data.currentAntiepilepticTreatments || undefined,
        otherTreatments: data.otherTreatments || undefined,
        examCondition: data.examCondition || undefined,
        sedationProtocol: data.sedationProtocol || undefined,
        eegSpecificEvents: data.eegSpecificEvents || undefined,
        duringExamClinical: data.duringExamClinical || undefined,
        comments: data.comments || undefined,
      };

      await updateExam(_examen.id, dataToSubmit);
      router.refresh();
    },
    [_examen, router]
  );

  const value = {
    examen: _examen,
    animal: _animal,
    animals: _animals,
    schema,
    defaults,
    currentAnimal,
    statusOptions,
    manifestationCategoryOptions,
    paroxysmalSubtypeOptions,
    manifestationFrequencyOptions,
    searchAnimals,
    handleSubmit,
    setDefaults,
  };

  return (
    <ExamenDetailContext.Provider value={value}>
      {children}
    </ExamenDetailContext.Provider>
  );
};

export const useExamenDetailContext = () => {
  const context = useContext(ExamenDetailContext);
  if (!context) {
    throw new Error(
      'useExamenDetailContext must be used within a ExamenDetailProvider'
    );
  }
  return context;
};
