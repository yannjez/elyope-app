'use client';

import { AnimalFull, ExamWithRelations, ExamStatusType } from '@elyope/db';
import {
  ManifestationCategory,
  ParoxysmalSubtype,
  ExamCondition,
} from '@prisma/client';
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
import {
  z,
  TreeSelectionSelection,
  TreeSelectionSelectionValue,
} from '@app-test2/shared-components';

// Manifestation-specific database conversion functions
function manifestationSelectionsToDb(
  selections: Record<string, TreeSelectionSelectionValue>
) {
  const selectedKeys = Object.entries(selections)
    .filter(([, value]) => value.isChecked)
    .map(([key]) => key);

  // Extract unique categories and map them to enums
  const categoryKeys = [
    ...new Set(selectedKeys.map((key) => key.split('.')[0])),
  ];
  const manifestationCategories: ManifestationCategory[] = categoryKeys
    .map((key) => {
      switch (key) {
        case 'paroxysmal':
          return ManifestationCategory.PAROXYSMAL;
        case 'status_epilepticus':
          return ManifestationCategory.STATUS_EPILEPTICUS;
        case 'vigilance':
          return ManifestationCategory.ALERTNESS;
        case 'troubles_vigilance':
          return ManifestationCategory.DISTURBANCE_OF_ALERTNESS;
        case 'modifications_comportement':
          return ManifestationCategory.BEHAVIOR_CHANGES;
        case 'other':
          return ManifestationCategory.OTHER;
        default:
          return null;
      }
    })
    .filter((cat): cat is ManifestationCategory => cat !== null);

  // Handle paroxysmal subtypes (only first one for now since enum is single value)
  const paroxysmalSubtypeKeys = selectedKeys
    .filter((key) => key.startsWith('paroxysmal.'))
    .map((key) => key.split('.')[1]);

  const paroxysmalSubtype =
    paroxysmalSubtypeKeys.length > 0
      ? paroxysmalSubtypeKeys[0] === 'isolated'
        ? ParoxysmalSubtype.ISOLATED
        : ParoxysmalSubtype.GROUPED
      : null;

  // Handle "other" text value
  const otherTextValue =
    Object.entries(selections).find(
      ([key, value]) => key.includes('other') && value.isChecked
    )?.[1]?.textValue || '';

  return {
    manifestationCategory: manifestationCategories,
    paroxysmalSubtype,
    manifestationOther: otherTextValue || undefined,
  };
}

function manifestationSelectionsFromDb(
  manifestationCategories: ManifestationCategory[] = [],
  paroxysmalSubtype?: ParoxysmalSubtype | null,
  manifestationOther = ''
): Record<string, TreeSelectionSelectionValue> {
  const result: Record<string, TreeSelectionSelectionValue> = {};

  // Convert enum categories back to form keys
  manifestationCategories.forEach((category) => {
    let categoryKey = '';
    switch (category) {
      case ManifestationCategory.PAROXYSMAL:
        categoryKey = 'paroxysmal';
        break;
      case ManifestationCategory.STATUS_EPILEPTICUS:
        categoryKey = 'status_epilepticus';
        break;
      case ManifestationCategory.ALERTNESS:
        categoryKey = 'vigilance';
        break;
      case ManifestationCategory.DISTURBANCE_OF_ALERTNESS:
        categoryKey = 'troubles_vigilance';
        break;
      case ManifestationCategory.BEHAVIOR_CHANGES:
        categoryKey = 'modifications_comportement';
        break;
      case ManifestationCategory.OTHER:
        categoryKey = 'other';
        break;
    }

    if (categoryKey) {
      // For paroxysmal category, handle subtypes
      if (categoryKey === 'paroxysmal' && paroxysmalSubtype) {
        const subtypeKey =
          paroxysmalSubtype === ParoxysmalSubtype.ISOLATED
            ? 'isolated'
            : 'grouped';
        const key = `${categoryKey}.${subtypeKey}`;
        result[key] = {
          key,
          isChecked: true,
          textValue: undefined,
        };
      } else if (categoryKey !== 'paroxysmal') {
        // For non-paroxysmal categories, just select the category
        result[categoryKey] = {
          key: categoryKey,
          isChecked: true,
          textValue: categoryKey === 'other' ? manifestationOther : undefined,
        };
      }
    }
  });

  return result;
}

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
    manifestations: z
      .record(
        z.object({
          key: z.string(),
          isChecked: z.boolean(),
          textValue: z.string().optional(),
        })
      )
      .optional(),
    // Legacy fields for backward compatibility
    manifestationCategory: z.string().optional(),
    paroxysmalSubtype: z.union([z.string(), z.null()]).optional(),
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
    additionalExams: z
      .record(
        z.object({
          key: z.string(),
          isChecked: z.boolean(),
          textValue: z.string().optional(),
        })
      )
      .optional(),
    clinicalSuspicion: z.string().optional(),
    currentAntiepilepticTreatments: z.string().optional(),
    otherTreatments: z.string().optional(),
    examCondition: z.nativeEnum(ExamCondition).optional(),
    examConditionDescription: z.string().optional(),
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
  manifestationData: TreeSelectionSelection[];
  manifestationFrequencyOptions: { value: string; label: string }[];
  examConditionData: TreeSelectionSelection[];
  additionalExamsData: TreeSelectionSelection[];
  // Functions
  searchAnimals: (keyword: string) => Promise<AnimalFull[]>;
  handleSubmit: (data: ExamenFormData) => Promise<void>;
  setDefaults: (defaults: ExamenFormData) => void;
  // Validation functions
  validateManifestations: (
    manifestations: Record<string, TreeSelectionSelectionValue> | undefined
  ) => { isValid: boolean; errors: string[] };
  validateAdditionalExams: (
    additionalExams: Record<string, TreeSelectionSelectionValue> | undefined
  ) => { isValid: boolean; errors: string[] };
  validateExamConditions: (
    examCondition: string | undefined,
    examConditionDescription: string | undefined
  ) => { isValid: boolean; errors: string[] };
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
          vetReference: _examen.vetReference ?? '',
          requestReason: _examen.requestReason ?? '',
          history: _examen.history ?? '',
          clinicalExams: _examen.clinicalExams ?? '',
          manifestations: manifestationSelectionsFromDb(
            _examen.manifestationCategory ?? [],
            _examen.paroxysmalSubtype ?? null,
            _examen.manifestationOther ?? ''
          ) as Record<
            string,
            { key: string; isChecked: boolean; textValue?: string }
          >,
          // Legacy fields for backward compatibility
          manifestationCategory: _examen.manifestationCategory?.[0] ?? '',
          paroxysmalSubtype: _examen.paroxysmalSubtype?.toString() ?? '',
          manifestationOther: _examen.manifestationOther ?? '',
          firstManifestationAt: _examen.firstManifestationAt
            ? new Date(_examen.firstManifestationAt).toISOString().split('T')[0]
            : '',
          lastManifestationAt: _examen.lastManifestationAt
            ? new Date(_examen.lastManifestationAt).toISOString().split('T')[0]
            : '',
          manifestationDescription: _examen.manifestationDescription ?? '',
          manifestationFrequency: _examen.manifestationFrequency ?? '',
          avgManifestationDurationMin:
            _examen.avgManifestationDurationMin?.toString() ?? '',
          additionalExams: {},
          clinicalSuspicion: _examen.clinicalSuspicion ?? '',
          currentAntiepilepticTreatments:
            _examen.currentAntiepilepticTreatments ?? '',
          otherTreatments: _examen.otherTreatments ?? '',
          examCondition: _examen.examCondition as ExamCondition | undefined,
          examConditionDescription: _examen.examConditionDescription ?? '',
          eegSpecificEvents: _examen.eegSpecificEvents ?? '',
          duringExamClinical: _examen.duringExamClinical ?? '',
          comments: _examen.comments ?? '',
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

  const additionalExamsData = useMemo<TreeSelectionSelection[]>(
    () => [
      {
        key: 'NFS',
        label: t('fields.additionalExams.options.NFS'),
        hasTextField: true,
        textFieldPlaceholder: t('fields.additionalExams.placeholders.NFS'),
      },
      {
        key: 'BIOCHEMISTRY',
        label: t('fields.additionalExams.options.BIOCHEMISTRY'),
        hasTextField: true,
        textFieldPlaceholder: t(
          'fields.additionalExams.placeholders.BIOCHEMISTRY'
        ),
      },
      {
        key: 'BILE_ACIDS_PRE_POST',
        label: t('fields.additionalExams.options.BILE_ACIDS_PRE_POST'),
        hasTextField: true,
        textFieldPlaceholder: t(
          'fields.additionalExams.placeholders.BILE_ACIDS_PRE_POST'
        ),
      },
      {
        key: 'MRI',
        label: t('fields.additionalExams.options.MRI'),
        hasTextField: true,
        textFieldPlaceholder: t('fields.additionalExams.placeholders.MRI'),
      },
      {
        key: 'OTHER',
        label: t('fields.additionalExams.options.OTHER'),
        hasTextField: true,
        textFieldPlaceholder: t('fields.additionalExams.placeholders.OTHER'),
      },
    ],
    [t]
  );

  // Manifestation data for hierarchical component
  const manifestationData = useMemo<TreeSelectionSelection[]>(
    () => [
      {
        key: 'paroxysmal',
        label: t('fields.manifestationCategory.options.paroxysmal'),
        childrenBehavior: 'single',
        subChoice: [
          {
            key: 'isolated',
            label: t('fields.paroxysmalSubtype.options.isolated'),
            hasTextField: false,
          },
          {
            key: 'grouped',
            label: t('fields.paroxysmalSubtype.options.grouped'),
            hasTextField: false,
          },
        ],
        hasTextField: false,
      },
      {
        key: 'status_epilepticus',
        label: t('fields.paroxysmalSubtype.options.status_epilepticus'),
        hasTextField: false,
      },
      {
        key: 'vigilance',
        label: t('fields.manifestationCategory.options.vigilance'),
        hasTextField: false,
      },
      {
        key: 'troubles_vigilance',
        label: t('fields.manifestationCategory.options.troubles_vigilance'),
        hasTextField: false,
      },
      {
        key: 'modifications_comportement',
        label: t(
          'fields.manifestationCategory.options.modifications_comportement'
        ),
        hasTextField: false,
      },
      {
        key: 'other',
        label: t('fields.manifestationCategory.options.other'),
        hasTextField: true,
        textFieldPlaceholder: t('fields.general_placeholder'),
      },
    ],
    [t]
  );

  const examConditionData = useMemo<TreeSelectionSelection[]>(
    () => [
      {
        key: 'AWAKE_EXAM',
        label: t('fields.examCondition.options.awake_exam'),
        hasTextField: true,
        textFieldPlaceholder: t('fields.general_placeholder'),
      },
      {
        key: 'SEDATION_AT_PLACEMENT',
        label: t('fields.examCondition.options.sedation_at_placement'),
        hasTextField: true,
        textFieldPlaceholder: t('fields.general_placeholder'),
      },
      {
        key: 'UNDER_SEDATION',
        label: t('fields.examCondition.options.under_sedation'),
        hasTextField: true,
        textFieldPlaceholder: t('fields.general_placeholder'),
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

  // Validation functions
  const validateManifestations = useCallback(
    (
      manifestations: Record<string, TreeSelectionSelectionValue> | undefined
    ) => {
      if (!manifestations) return { isValid: true, errors: [] };

      const errors: string[] = [];

      manifestationData.forEach((category) => {
        const categoryKey = category.key;
        const categorySelection = manifestations[categoryKey];
        const isCategorySelected = categorySelection?.isChecked || false;
        const categoryTextValue = categorySelection?.textValue || '';

        // Check category validation
        if (
          isCategorySelected &&
          category.hasTextField &&
          (!categoryTextValue || categoryTextValue.trim() === '')
        ) {
          errors.push(`${category.label} ${t('fields.description_required')}`);
        }

        // Check subtypes validation
        if (category.subChoice) {
          category.subChoice.forEach((subtype) => {
            const subtypeKey = `${categoryKey}.${subtype.key}`;
            const subtypeSelection = manifestations[subtypeKey];
            const isSubtypeSelected = subtypeSelection?.isChecked || false;
            const subtypeTextValue = subtypeSelection?.textValue || '';

            if (
              isSubtypeSelected &&
              subtype.hasTextField &&
              (!subtypeTextValue || subtypeTextValue.trim() === '')
            ) {
              errors.push(
                `${subtype.label} ${t('fields.description_required')}`
              );
            }
          });
        }
      });

      return { isValid: errors.length === 0, errors };
    },
    [manifestationData, t]
  );

  const validateAdditionalExams = useCallback(
    (
      additionalExams: Record<string, TreeSelectionSelectionValue> | undefined
    ) => {
      if (!additionalExams) return { isValid: true, errors: [] };

      const errors: string[] = [];

      additionalExamsData.forEach((exam) => {
        const examKey = exam.key;
        const examSelection = additionalExams[examKey];
        const isExamSelected = examSelection?.isChecked || false;
        const examTextValue = examSelection?.textValue || '';

        if (
          isExamSelected &&
          exam.hasTextField &&
          (!examTextValue || examTextValue.trim() === '')
        ) {
          errors.push(`${exam.label} ${t('fields.description_required')}`);
        }
      });

      return { isValid: errors.length === 0, errors };
    },
    [additionalExamsData, t]
  );

  const validateExamConditions = useCallback(
    (
      examCondition: string | undefined,
      examConditionDescription: string | undefined
    ) => {
      if (!examCondition) return { isValid: true, errors: [] };

      const errors: string[] = [];

      // All exam condition options require text description
      if (
        examCondition &&
        (!examConditionDescription || examConditionDescription.trim() === '')
      ) {
        const conditionLabels = {
          AWAKE_EXAM: t('exam_condition_options.awake_exam.label'),
          SEDATION_AT_PLACEMENT: t(
            'exam_condition_options.sedation_at_placement.label'
          ),
          UNDER_SEDATION: t('exam_condition_options.under_sedation.label'),
        };

        const label =
          conditionLabels[examCondition as keyof typeof conditionLabels] ||
          examCondition;
        errors.push(`${label} ${t('fields.description_required')}`);
      }

      return { isValid: errors.length === 0, errors };
    },
    [t]
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
        // Convert manifestation data to database format
        ...manifestationSelectionsToDb(data.manifestations || {}),
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
        examCondition: data.examCondition as ExamCondition | undefined,
        examConditionDescription: data.examConditionDescription || undefined,
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
    manifestationData,
    additionalExamsData,
    manifestationFrequencyOptions,
    searchAnimals,
    handleSubmit,
    setDefaults,
    examConditionData,
    validateManifestations,
    validateAdditionalExams,
    validateExamConditions,
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
