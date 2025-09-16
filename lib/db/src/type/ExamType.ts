import {
  type Prisma,
  type Exam,
  type ExamStatus as PrismaExamStatus,
  type ManifestationCategory as PrismaManifestationCategory,
  type ExamAdditionalTest as PrismaExamAdditionalTest,
} from '@prisma/client';
import { AnimalFull } from './AnimalType.js';

export type ExamWithRelations = Prisma.ExamGetPayload<{
  include: {
    animal: {
      include: {
        breed: true;
      };
    };
    structure: true;
    interpreter: true;
    attachments: true;
    additionalTests: true;
  };
}>;

export type ExamCompletedSummary = Pick<
  Exam,
  'id' | 'requestedAt' | 'vetReference'
>;

export type ExamFullDetail = {
  exam: ExamWithRelations;
  animal: AnimalFull;
  completedExams: ExamCompletedSummary[];
};

export type ExamSortField =
  | 'requestedAt'
  | 'status'
  | 'animalName'
  | 'vetReference'
  | 'structureName';

export type CanDeleteExamReason = {
  linkedAttachments: boolean;
  linkedAdditionalTests: boolean;
};

export type ExamStatus = PrismaExamStatus;
export const ExamStatus = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  COMPLETED: 'COMPLETED',
  ARCHIVED: 'ARCHIVED',
  CANCELLED: 'CANCELLED',
};

// Using Prisma's generated types
export type ExamCreateInput = Prisma.ExamCreateInput;
export type ExamUpdateInput = Prisma.ExamUpdateInput;

export type ManifestationCategory = PrismaManifestationCategory;

export const ManifestationCategory = {
  PAROXYSMAL: 'PAROXYSMAL',
  STATUS_EPILEPTICUS: 'STATUS_EPILEPTICUS',
  ALERTNESS: 'ALERTNESS',
  DISTURBANCE_OF_ALERTNESS: 'DISTURBANCE_OF_ALERTNESS',
  BEHAVIOR_CHANGES: 'BEHAVIOR_CHANGES',
  OTHER: 'OTHER',
} as const;

export type ParoxysmalSubtype = 'ISOLATED' | 'GROUPED';
export const ParoxysmalSubtype = {
  ISOLATED: 'ISOLATED',
  GROUPED: 'GROUPED',
} as const;

export type ExamCondition =
  | 'AWAKE_EXAM'
  | 'SEDATION_AT_PLACEMENT'
  | 'UNDER_SEDATION';
//export const ExamCondition = PrismaExamCondition;
export const ExamCondition = {
  AWAKE_EXAM: 'AWAKE_EXAM',
  SEDATION_AT_PLACEMENT: 'SEDATION_AT_PLACEMENT',
  UNDER_SEDATION: 'UNDER_SEDATION',
};

export type ExamAdditionalTest = PrismaExamAdditionalTest;

export type ExamAdditionalTestType =
  | 'NFS'
  | 'BIOCHEMISTRY'
  | 'BILE_ACIDS_PRE_POST'
  | 'MRI'
  | 'LCS'
  | 'OTHER';
//export const ExamAdditionalTestType = PrismaExamAdditionalTestType;
export const ExamAdditionalTestType = {
  NFS: 'NFS',
  BIOCHEMISTRY: 'BIOCHEMISTRY',
  BILE_ACIDS_PRE_POST: 'BILE_ACIDS_PRE_POST',
  MRI: 'MRI',
  LCS: 'LCS',
  OTHER: 'OTHER',
};
