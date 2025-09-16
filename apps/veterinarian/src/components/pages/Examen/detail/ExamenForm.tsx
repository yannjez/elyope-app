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
  SelectMultiTreeOptions,
  SelectTreeOptions,
  TreeSelectionValue,
} from '@app-test2/shared-components';

import { AnimalFull } from '@elyope/db';
import { useTranslations } from 'next-intl';
import { useCallback, useState } from 'react';
import { useExamenDetailContext, ExamenFormData } from './ExamenDetailContext';

export default function ExamenForm() {
  const {
    examen,
    schema,
    defaults,
    handleSubmit,
    validateManifestations,
    validateAdditionalExams,
    validateExamConditions,
  } = useExamenDetailContext();

  const t = useTranslations('Data.Examen.edit');
  const tCommon = useTranslations('Data.Common');

  // State for validation errors to display near save button
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Function to clear validation errors when user starts fixing them
  const clearValidationErrors = useCallback(() => {
    if (validationErrors.length > 0) {
      setValidationErrors([]);
    }
  }, [validationErrors.length]);

  // Custom submit handler that validates the three non-HTML5 fields
  const onSubmit = useCallback(
    (data: ExamenFormData) => {
      // Validate the three non-HTML5 fields
      const manifestationsValidation = validateManifestations(
        data.manifestations
      );
      const additionalExamsValidation = validateAdditionalExams(
        data.additionalExams
      );
      const examConditionsValidation = validateExamConditions(
        data.examCondition,
        data.examConditionDescription
      );

      // Collect all validation errors
      const allErrors = [
        ...manifestationsValidation.errors,
        ...additionalExamsValidation.errors,
        ...examConditionsValidation.errors,
      ];

      if (allErrors.length > 0) {
        console.warn(
          'Form submission blocked due to validation errors:',
          allErrors
        );
        setValidationErrors(allErrors);
        return;
      }

      // Clear any previous validation errors and submit
      setValidationErrors([]);
      handleSubmit(data);
    },
    [
      validateManifestations,
      validateAdditionalExams,
      validateExamConditions,
      handleSubmit,
    ]
  );

  if (!examen || !defaults) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <FormPanel title={t('form_title')} className="main-container w-full">
        <ZodForm
          schema={schema}
          onSubmit={onSubmit}
          defaultValues={defaults}
          className="space-y-4 max-w-4xl"
        >
          <div className="flex flex-col gap-2 ">
            {/* Basic Information */}

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

            <FormSeparator className="w-full my-4" />

            {/* Clinical Context */}

            <FormField
              name="requestReason"
              label={t('fields.requestReason.label')}
            >
              <Textarea
                placeholder={t('fields.requestReason.placeholder')}
                lines={2}
              />
            </FormField>

            <div className="text-12 py-5 flex gap-2 justify-between bg-el-grey-100">
              <div> &nbsp; </div>
              <div className=" w-2/3 p-5">
                <strong>TODO:</strong> Add upload for animal exam related files
              </div>
            </div>

            <FormField name="history" label={t('fields.history.label')}>
              <Textarea
                placeholder={t('fields.history.placeholder')}
                lines={2}
              />
            </FormField>

            <FormField
              name="clinicalExams"
              label={t('fields.clinicalExams.label')}
            >
              <Textarea
                placeholder={t('fields.clinicalExams.placeholder')}
                lines={2}
              />
            </FormField>

            <FormSeparator className="w-full my-4" />

            {/* Manifestations */}

            <FormField
              name="manifestations"
              label={t('fields.manifestationCategory.label')}
            >
              <SelectManifestationsField
                onClearErrors={clearValidationErrors}
              />
            </FormField>

            <FormField
              name="firstManifestationAt"
              label={t('fields.firstManifestationAt.label')}
            >
              <Input type="date" />
            </FormField>

            <FormField
              name="lastManifestationAt"
              label={t('fields.lastManifestationAt.label')}
            >
              <Input type="date" />
            </FormField>

            <FormField
              name="manifestationDescription"
              label={t('fields.manifestationDescription.label')}
            >
              <Textarea
                placeholder={t('fields.manifestationDescription.placeholder')}
                lines={2}
              />
            </FormField>
            <div className="text-12 py-5 flex gap-2 justify-between bg-el-grey-100">
              <div> &nbsp; </div>
              <div className=" w-2/3 p-5">
                <strong>TODO:</strong>dd upload for animal crisis média
              </div>
            </div>

            <FormField
              name="manifestationFrequency"
              label={t('fields.manifestationFrequency.label')}
            >
              <SelectFrequency />
            </FormField>

            <FormField
              name="avgManifestationDurationMin"
              label={t('fields.avgManifestationDurationMin.label')}
            >
              <Input
                type="text"
                placeholder={t(
                  'fields.avgManifestationDurationMin.placeholder'
                )}
              />
            </FormField>

            <FormField
              name="additionalExams"
              label={t('fields.additionalExams.label')}
            >
              <SelectAdditionalTestsField
                onClearErrors={clearValidationErrors}
              />
            </FormField>

            {/* Diagnosis & Treatments */}

            <FormField
              name="clinicalSuspicion"
              label={t('fields.clinicalSuspicion.label')}
            >
              <Textarea
                placeholder={t('fields.clinicalSuspicion.placeholder')}
                lines={2}
              />
            </FormField>

            <FormField
              name="currentAntiepilepticTreatments"
              label={t('fields.currentAntiepilepticTreatments.label')}
            >
              <Textarea
                placeholder={t(
                  'fields.currentAntiepilepticTreatments.placeholder'
                )}
                lines={2}
              />
            </FormField>

            <FormField
              name="otherTreatments"
              label={t('fields.otherTreatments.label')}
            >
              <Textarea
                placeholder={t('fields.otherTreatments.placeholder')}
                lines={2}
              />
            </FormField>

            <FormSeparator className="w-full my-4" />

            {/* Exam Conditions */}

            <FormField
              name="examConditions"
              label={t('fields.examCondition.label')}
            >
              <SelectExamConditionsField
                onClearErrors={clearValidationErrors}
              />
            </FormField>

            <FormSeparator className="w-full my-4" />

            {/* EEG & Clinical Notes */}

            <FormField
              name="eegSpecificEvents"
              label={t('fields.eegSpecificEvents.label')}
            >
              <Textarea
                placeholder={t('fields.eegSpecificEvents.placeholder')}
                lines={2}
              />
            </FormField>

            <FormField
              name="duringExamClinical"
              label={t('fields.duringExamClinical.label')}
            >
              <Textarea
                placeholder={t('fields.duringExamClinical.placeholder')}
                lines={2}
              />
            </FormField>

            {/* Comments */}

            <FormField name="comments" label={t('fields.comments.label')}>
              <Textarea
                placeholder={t('fields.comments.placeholder')}
                lines={2}
              />
            </FormField>

            <div>
              <Button type="submit" className="button-primary">
                {tCommon('actions.save')}
              </Button>

              {/* Display validation errors */}
              {validationErrors.length > 0 && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-red-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">
                        {t('validation.form_has_errors')}
                      </h3>
                      <div className="mt-2 text-sm text-red-700">
                        <ul className="list-disc list-inside space-y-1">
                          {validationErrors.map((error, index) => (
                            <li key={index}>{error}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}
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

function SelectManifestationsField({
  onClearErrors,
}: {
  onClearErrors?: () => void;
}) {
  const { manifestationData, defaults } = useExamenDetailContext();
  const form = useFormContext<ExamenFormData>();
  const t = useTranslations('Data.Examen.edit');

  return (
    <SelectMultiTreeOptions
      data={manifestationData}
      value={defaults?.manifestations}
      t={t}
      onValueChange={(selectedValue: Record<string, TreeSelectionValue>) => {
        onClearErrors?.(); // Clear validation errors when user makes changes
        if (form) {
          // Ensure all isChecked are boolean, not undefined
          const sanitizedValue = Object.fromEntries(
            Object.entries(selectedValue).map(([k, v]) => [
              k,
              {
                ...v,
                isChecked: v.isChecked ?? false,
              },
            ])
          );
          form.setValue('manifestations', sanitizedValue);
          form.trigger('manifestations');
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

function SelectAdditionalTestsField({
  onClearErrors,
}: {
  onClearErrors?: () => void;
}) {
  const { additionalExamsData, defaults } = useExamenDetailContext();
  const form = useFormContext<ExamenFormData>();
  const t = useTranslations('Data.Examen.edit');

  return (
    <SelectMultiTreeOptions
      data={additionalExamsData}
      value={defaults?.additionalExams}
      t={t}
      onValueChange={(selectedValue: Record<string, TreeSelectionValue>) => {
        onClearErrors?.(); // Clear validation errors when user makes changes
        if (form) {
          // Ensure all isChecked are boolean, not undefined
          const sanitizedValue = Object.fromEntries(
            Object.entries(selectedValue).map(([k, v]) => [
              k,
              {
                ...v,
                isChecked: v.isChecked ?? false,
              },
            ])
          ) as Record<
            string,
            {
              key:
                | 'NFS'
                | 'BIOCHEMISTRY'
                | 'BILE_ACIDS_PRE_POST'
                | 'MRI'
                | 'LCS'
                | 'OTHER';
              isChecked: boolean;
              textValue: string;
            }
          >;
          form.setValue('additionalExams', sanitizedValue);
          form.trigger('additionalExams');
        }
      }}
    />
  );
}

function SelectExamConditionsField({
  onClearErrors,
}: {
  onClearErrors?: () => void;
}) {
  const { defaults } = useExamenDetailContext();
  const form = useFormContext<ExamenFormData>();
  const t = useTranslations('Data.Examen.edit');

  return (
    <SelectTreeOptions
      name="examCondition"
      t={t}
      options={[
        {
          key: 'AWAKE_EXAM',
          label: t('exam_condition_options.awake_exam.label'),
          hasTextField: true,
          textFieldPlaceholder: t(
            'exam_condition_options.awake_exam.placeholder'
          ),
        },
        {
          key: 'SEDATION_AT_PLACEMENT',
          label: t('exam_condition_options.sedation_at_placement.label'),
          hasTextField: true,
          textFieldPlaceholder: t(
            'exam_condition_options.sedation_at_placement.placeholder'
          ),
        },
        {
          key: 'UNDER_SEDATION',
          label: t('exam_condition_options.under_sedation.label'),
          hasTextField: true,
          textFieldPlaceholder: t(
            'exam_condition_options.under_sedation.placeholder'
          ),
        },
      ]}
      value={{
        key: (defaults?.examCondition || '') as string,
        textValue: defaults?.examConditionDescription || '',
      }}
      onValueChange={(key: string, textValue: string) => {
        onClearErrors?.(); // Clear validation errors when user makes changes
        if (form) {
          form.setValue(
            'examCondition',
            key as 'AWAKE_EXAM' | 'SEDATION_AT_PLACEMENT' | 'UNDER_SEDATION'
          );
          form.trigger('examCondition');
          form.setValue('examConditionDescription', textValue);
          form.trigger('examConditionDescription');
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
