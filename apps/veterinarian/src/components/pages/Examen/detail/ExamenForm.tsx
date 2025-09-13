'use client';

import {
  Button,
  FormField,
  FormPanel,
  FormSeparator,
  Input,
  Textarea,
  ZodForm,
  useFormContext,
  SelectButton,
  SelectEntity,
} from '@app-test2/shared-components';

import { AnimalFull } from '@elyope/db';
import { useTranslations } from 'next-intl';
import { useExamenDetailContext, ExamenFormData } from './ExamenDetailContext';

export default function ExamenForm() {
  const { examen, schema, defaults, handleSubmit } = useExamenDetailContext();

  const t = useTranslations('Data.Examen.edit');
  const tCommon = useTranslations('Data.Common');

  if (!examen || !defaults) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <FormPanel title={t('form_title')} className="main-container w-full">
        <ZodForm
          schema={schema}
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
                <SelectStatus />
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
                <SelectAnimal />
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
                <SelectCategory />
              </FormField>

              <FormField
                name="paroxysmalSubtype"
                label={t('fields.paroxysmalSubtype.label')}
              >
                <SelectSubtype />
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
                <SelectFrequency />
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
function SelectStatus() {
  const { statusOptions, defaults } = useExamenDetailContext();
  const form = useFormContext<ExamenFormData>();

  return (
    <SelectButton
      options={statusOptions}
      value={defaults?.status || ''}
      onValueChange={(selectedValue) => {
        if (form) {
          form.setValue('status', selectedValue as ExamenFormData['status']);
          form.trigger('status');
        }
      }}
    />
  );
}

function SelectCategory() {
  const { manifestationCategoryOptions, defaults } = useExamenDetailContext();
  const form = useFormContext<ExamenFormData>();

  return (
    <SelectButton
      options={manifestationCategoryOptions}
      value={defaults?.manifestationCategory || ''}
      onValueChange={(selectedValue) => {
        if (form) {
          form.setValue('manifestationCategory', selectedValue);
          form.trigger('manifestationCategory');
        }
      }}
    />
  );
}

function SelectSubtype() {
  const { paroxysmalSubtypeOptions, defaults } = useExamenDetailContext();
  const form = useFormContext<ExamenFormData>();

  return (
    <SelectButton
      options={paroxysmalSubtypeOptions}
      value={defaults?.paroxysmalSubtype || ''}
      onValueChange={(selectedValue) => {
        if (form) {
          form.setValue('paroxysmalSubtype', selectedValue);
          form.trigger('paroxysmalSubtype');
        }
      }}
    />
  );
}

function SelectFrequency() {
  const { manifestationFrequencyOptions, defaults } = useExamenDetailContext();
  const form = useFormContext<ExamenFormData>();

  return (
    <SelectButton
      options={manifestationFrequencyOptions}
      value={defaults?.manifestationFrequency || ''}
      onValueChange={(selectedValue) => {
        if (form) {
          form.setValue('manifestationFrequency', selectedValue);
          form.trigger('manifestationFrequency');
        }
      }}
    />
  );
}

function SelectAnimal() {
  const { currentAnimal, animals, searchAnimals, setDefaults } =
    useExamenDetailContext();
  const t = useTranslations('Data.Examen.edit');
  const form = useFormContext<ExamenFormData>();

  return (
    <SelectEntity<AnimalFull>
      className="w-full min-w-0"
      name="animalId"
      placeholder={t('fields.animal.placeholder')}
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
      maxItems={10}
    />
  );
}
