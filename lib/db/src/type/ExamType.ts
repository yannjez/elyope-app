import { Prisma, ExamStatus as PrismaExamStatus, Exam } from '@prisma/client';
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

export const ExamStatus = {
  PENDING: PrismaExamStatus.PENDING,
  PROCESSING: PrismaExamStatus.PROCESSING,
  COMPLETED: PrismaExamStatus.COMPLETED,
  ARCHIVED: PrismaExamStatus.ARCHIVED,
  CANCELLED: PrismaExamStatus.CANCELLED,
};
export type ExamStatusType = keyof typeof ExamStatus;

// Using Prisma's generated types
export type ExamCreateInput = Prisma.ExamCreateInput;
export type ExamUpdateInput = Prisma.ExamUpdateInput;
