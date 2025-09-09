import { Prisma } from '@prisma/client';

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

// Using Prisma's generated types
export type ExamCreateInput = Prisma.ExamCreateInput;
export type ExamUpdateInput = Prisma.ExamUpdateInput;
