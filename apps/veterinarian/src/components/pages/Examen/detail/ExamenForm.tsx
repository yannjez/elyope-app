'use client';

import {
  Button,
  FormField,
  FormPanel,
  FormSeparator,
  Input,
  Textarea,
  ZodForm,
  z,
  useFormContext,
  SelectButton,
  SelectEntity,
} from '@app-test2/shared-components';

import { useState, useCallback, useMemo } from 'react';
import { updateExam, searchAnimalsForExamen } from '../../ExamenController';
import { useRouter } from 'next/navigation';
import { AnimalFull, AnimalWithBreed, ExamStatusType } from '@elyope/db';
import { useTranslations } from 'next-intl';
import { useExamenDetailContext } from './ExamenDetailContext';
import { useAppContext } from '@/components/layouts/AppContext';

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

export default function ExamenForm() {
  const { examen, animal, animals } = useExamenDetailContext();
  const { currentStructure } = useAppContext();
  const t = useTranslations('Data.Examen.edit');
  const tCommon = useTranslations('Data.Common');
  const tStatus = useTranslations('Data.Examen.status');
  const router = useRouter();

  // Create schema with translated validation messages
  const examenSchema = createExamenSchema(
    t('validation.status_required'),
    t('validation.date_required'),
    t('validation.invalid_date'),
    t('validation.animal_required')
  );

  const [defaults, setDefaults] = useState<ExamenFormData | null>(
    examen
      ? {
          status: examen.status as ExamStatusType,
          requestedAt: examen.requestedAt
            ? new Date(examen.requestedAt).toISOString().split('T')[0]
            : '',
          animalId: examen.animalId || '',
          vetReference: examen.vetReference || '',
          requestReason: examen.requestReason || '',
          history: examen.history || '',
          clinicalExams: examen.clinicalExams || '',
          manifestationCategory: examen.manifestationCategory || '',
          paroxysmalSubtype: examen.paroxysmalSubtype || '',
          manifestationOther: examen.manifestationOther || '',
          firstManifestationAt: examen.firstManifestationAt
            ? new Date(examen.firstManifestationAt).toISOString().split('T')[0]
            : '',
          lastManifestationAt: examen.lastManifestationAt
            ? new Date(examen.lastManifestationAt).toISOString().split('T')[0]
            : '',
          manifestationDescription: examen.manifestationDescription || '',
          manifestationFrequency: examen.manifestationFrequency || '',
          avgManifestationDurationMin:
            examen.avgManifestationDurationMin?.toString() || '',
          clinicalSuspicion: examen.clinicalSuspicion || '',
          currentAntiepilepticTreatments:
            examen.currentAntiepilepticTreatments || '',
          otherTreatments: examen.otherTreatments || '',
          examCondition: examen.examCondition || '',
          sedationProtocol: examen.sedationProtocol || '',
          eegSpecificEvents: examen.eegSpecificEvents || '',
          duringExamClinical: examen.duringExamClinical || '',
          comments: examen.comments || '',
        }
      : null
  );

  const currentAnimal = useMemo(() => {
    if (!defaults?.animalId || !animals) return null;
    return animals.find((animal) => animal.id === defaults?.animalId) || null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaults?.animalId]);

  const statusOptions = [
    { value: 'PENDING' as ExamStatusType, label: tStatus('PENDING') },
    {
      value: 'PROCESSING' as ExamStatusType,
      label: tStatus('PROCESSING'),
    },
    {
      value: 'COMPLETED' as ExamStatusType,
      label: tStatus('COMPLETED'),
    },
    {
      value: 'ARCHIVED' as ExamStatusType,
      label: tStatus('ARCHIVED'),
    },
    {
      value: 'CANCELLED' as ExamStatusType,
      label: tStatus('CANCELLED'),
    },
  ];

  const manifestationCategoryOptions = [
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
    { value: 'other', label: t('fields.manifestationCategory.options.other') },
  ];

  const paroxysmalSubtypeOptions = [
    {
      value: 'isolated',
      label: t('fields.paroxysmalSubtype.options.isolated'),
    },
    { value: 'grouped', label: t('fields.paroxysmalSubtype.options.grouped') },
    {
      value: 'status_epilepticus',
      label: t('fields.paroxysmalSubtype.options.status_epilepticus'),
    },
  ];

  const manifestationFrequencyOptions = [
    { value: 'daily', label: t('fields.manifestationFrequency.options.daily') },
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
  ];

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

  const handleSubmit = async (data: ExamenFormData) => {
    if (!examen) return;

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

    await updateExam(examen.id, dataToSubmit);
    router.refresh();
  };

  if (!examen || !defaults) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <FormPanel title={t('form_title')} className="main-container w-full">
        <ZodForm
          schema={examenSchema}
          onSubmit={handleSubmit}
          defaultValues={defaults}
          className="space-y-4 max-w-4xl"
        >
          <div className="flex flex-col gap-4">
            {/* Basic Information */}
            <div className="space-y-2">
              <h3 className="text-16 font-semibold text-el-grey-700">
                {t('sections.basic_info')}
              </h3>

              <FormField
                name="status"
                label={t('fields.status.label')}
                isMandatory
              >
                <SelectStatus
                  options={statusOptions}
                  currentStatus={defaults.status}
                />
              </FormField>

              <FormField
                name="requestedAt"
                label={t('fields.requestedAt.label')}
                isMandatory
              >
                <Input type="date" />
              </FormField>

              <FormField
                name="animalId"
                label={t('fields.animal.label')}
                isMandatory
              >
                <SelectAnimal
                  setDefaults={setDefaults}
                  currentAnimal={currentAnimal}
                  animals={animals}
                  searchAnimals={searchAnimals}
                  placeholder={t('fields.animal.placeholder')}
                />
              </FormField>

              <FormField
                name="vetReference"
                label={t('fields.vetReference.label')}
              >
                <Input placeholder={t('fields.vetReference.placeholder')} />
              </FormField>
            </div>

            <FormSeparator className="w-full my-4" />

            {/* Clinical Context */}
            <div className="space-y-2">
              <h3 className="text-16 font-semibold text-el-grey-700">
                {t('sections.clinical_context')}
              </h3>

              <FormField
                name="requestReason"
                label={t('fields.requestReason.label')}
              >
                <Textarea
                  placeholder="Enter the reason for the examination request"
                  lines={3}
                />
              </FormField>

              <FormField name="history" label={t('fields.history.label')}>
                <Textarea
                  placeholder="Enter patient medical history"
                  lines={4}
                />
              </FormField>

              <FormField
                name="clinicalExams"
                label={t('fields.clinicalExams.label')}
              >
                <Textarea
                  placeholder="Enter clinical examination findings"
                  lines={4}
                />
              </FormField>
            </div>

            <FormSeparator className="w-full my-4" />

            {/* Manifestations */}
            <div className="space-y-2">
              <h3 className="text-16 font-semibold text-el-grey-700">
                {t('sections.manifestations')}
              </h3>

              <FormField
                name="manifestationCategory"
                label={t('fields.manifestationCategory.label')}
              >
                <SelectCategory
                  options={manifestationCategoryOptions}
                  currentCategory={defaults.manifestationCategory}
                />
              </FormField>

              <FormField
                name="paroxysmalSubtype"
                label={t('fields.paroxysmalSubtype.label')}
              >
                <SelectSubtype
                  options={paroxysmalSubtypeOptions}
                  currentSubtype={defaults.paroxysmalSubtype}
                />
              </FormField>

              <FormField
                name="manifestationOther"
                label={t('fields.manifestationOther.label')}
              >
                <Input placeholder="Enter other manifestation details" />
              </FormField>

              <FormField
                name="firstManifestationAt"
                label="First Manifestation Date"
              >
                <Input type="date" />
              </FormField>

              <FormField
                name="lastManifestationAt"
                label="Last Manifestation Date"
              >
                <Input type="date" />
              </FormField>

              <FormField
                name="manifestationDescription"
                label="Manifestation Description"
              >
                <Textarea
                  placeholder="Describe the manifestations in detail"
                  lines={4}
                />
              </FormField>

              <FormField
                name="manifestationFrequency"
                label="Manifestation Frequency"
              >
                <SelectFrequency
                  options={manifestationFrequencyOptions}
                  currentFrequency={defaults.manifestationFrequency}
                />
              </FormField>

              <FormField
                name="avgManifestationDurationMin"
                label="Average Duration (minutes)"
              >
                <Input type="text" placeholder="Enter duration in minutes" />
              </FormField>
            </div>

            <FormSeparator className="w-full my-4" />

            {/* Additional Tests */}
            <div className="space-y-2">
              <h3 className="text-16 font-semibold text-el-grey-700">
                Additional Tests
              </h3>
              <div className="text-12 text-el-orange-500">
                TODO: Create AdditionalTests component for multiple test entries
              </div>
            </div>

            <FormSeparator className="w-full my-4" />

            {/* Diagnosis & Treatments */}
            <div className="space-y-2">
              <h3 className="text-16 font-semibold text-el-grey-700">
                Diagnosis & Treatments
              </h3>

              <FormField name="clinicalSuspicion" label="Clinical Suspicion">
                <Textarea
                  placeholder="Enter clinical suspicion and preliminary diagnosis"
                  lines={3}
                />
              </FormField>

              <FormField
                name="currentAntiepilepticTreatments"
                label="Current Antiepileptic Treatments"
              >
                <Textarea
                  placeholder="List current antiepileptic medications and dosages"
                  lines={3}
                />
              </FormField>

              <FormField name="otherTreatments" label="Other Treatments">
                <Textarea
                  placeholder="List other medications and treatments"
                  lines={3}
                />
              </FormField>
            </div>

            <FormSeparator className="w-full my-4" />

            {/* Exam Conditions */}
            <div className="space-y-2">
              <h3 className="text-16 font-semibold text-el-grey-700">
                Exam Conditions
              </h3>

              <FormField name="examCondition" label="Exam Condition">
                <Textarea
                  placeholder="Describe the conditions during the examination"
                  lines={3}
                />
              </FormField>

              <FormField name="sedationProtocol" label="Sedation Protocol">
                <Textarea
                  placeholder="Describe sedation protocol and medications used"
                  lines={3}
                />
              </FormField>
            </div>

            <FormSeparator className="w-full my-4" />

            {/* EEG & Clinical Notes */}
            <div className="space-y-2">
              <h3 className="text-16 font-semibold text-el-grey-700">
                EEG & Clinical Notes
              </h3>

              <FormField name="eegSpecificEvents" label="EEG Specific Events">
                <Textarea
                  placeholder="Describe specific EEG events and findings"
                  lines={4}
                />
              </FormField>

              <FormField
                name="duringExamClinical"
                label="During Exam Clinical Notes"
              >
                <Textarea
                  placeholder="Clinical observations and notes during the examination"
                  lines={4}
                />
              </FormField>
            </div>

            <FormSeparator className="w-full my-4" />

            {/* Comments */}
            <div className="space-y-2">
              <h3 className="text-16 font-semibold text-el-grey-700">
                Comments
              </h3>

              <FormField name="comments" label="Comments">
                <Textarea
                  placeholder="Additional comments and observations"
                  lines={3}
                />
              </FormField>
            </div>

            <FormSeparator className="w-full my-4" />

            {/* Attachments */}
            <div className="space-y-2">
              <h3 className="text-16 font-semibold text-el-grey-700">
                Attachments
              </h3>
              <div className="text-12 text-el-orange-500">
                TODO: Create FileUpload component for exam attachments
              </div>
            </div>

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

// Helper components for select fields
function SelectStatus({
  options,
  currentStatus,
}: {
  options: { value: string; label: string }[];
  currentStatus?: string;
}) {
  const form = useFormContext<ExamenFormData>();

  return (
    <SelectButton
      options={options}
      value={currentStatus || ''}
      onValueChange={(selectedValue) => {
        if (form) {
          form.setValue('status', selectedValue as ExamenFormData['status']);
          form.trigger('status');
        }
      }}
    />
  );
}

function SelectCategory({
  options,
  currentCategory,
}: {
  options: { value: string; label: string }[];
  currentCategory?: string;
}) {
  const form = useFormContext<ExamenFormData>();

  return (
    <SelectButton
      options={options}
      value={currentCategory || ''}
      onValueChange={(selectedValue) => {
        if (form) {
          form.setValue('manifestationCategory', selectedValue);
          form.trigger('manifestationCategory');
        }
      }}
    />
  );
}

function SelectSubtype({
  options,
  currentSubtype,
}: {
  options: { value: string; label: string }[];
  currentSubtype?: string;
}) {
  const form = useFormContext<ExamenFormData>();

  return (
    <SelectButton
      options={options}
      value={currentSubtype || ''}
      onValueChange={(selectedValue) => {
        if (form) {
          form.setValue('paroxysmalSubtype', selectedValue);
          form.trigger('paroxysmalSubtype');
        }
      }}
    />
  );
}

function SelectFrequency({
  options,
  currentFrequency,
}: {
  options: { value: string; label: string }[];
  currentFrequency?: string;
}) {
  const form = useFormContext<ExamenFormData>();

  return (
    <SelectButton
      options={options}
      value={currentFrequency || ''}
      onValueChange={(selectedValue) => {
        if (form) {
          form.setValue('manifestationFrequency', selectedValue);
          form.trigger('manifestationFrequency');
        }
      }}
    />
  );
}

function SelectAnimal({
  currentAnimal,
  animals,
  searchAnimals,
  placeholder,
  setDefaults,
}: {
  setDefaults: (defaults: ExamenFormData) => void;
  currentAnimal: AnimalFull | null;
  animals?: AnimalFull[];
  searchAnimals: (keyword: string) => Promise<AnimalFull[]>;
  placeholder: string;
}) {
  const form = useFormContext<ExamenFormData>();

  return (
    <SelectEntity<AnimalFull>
      className="w-full min-w-0"
      name="animalId"
      placeholder={placeholder}
      value={currentAnimal}
      onChange={(animal) => {
        if (form) {
          setDefaults({
            ...form.getValues(),
            animalId: animal?.id || '',
          });
          form.setValue('animalId', animal?.id || '');
          form.trigger('animalId');
        }
      }}
      getItemLabel={(a) => ` ${a?.fullBreed} > ${a?.name} `}
      getFormValue={(animal) => animal?.id || ''}
      loadInitial={() => Promise.resolve(animals || [])}
      search={searchAnimals}
      maxItems={5}
    />
  );
}
