'use server';

import { prisma } from '@/db';
import {
  ExamWithRelations,
  ExamenService,
  PaginationInfo,
  ExamSortField,
  ExamStatus,
  ExamFullDetail,
} from '@elyope/db';

export type ExamenRequest = {
  page?: number;
  sort?: string;
  sortDirection?: string;
  keyword?: string;
  structureId: string;
  status?: keyof typeof ExamStatus;
};

export const getExams = async (
  request: ExamenRequest
): Promise<{ data: ExamWithRelations[]; pagination: PaginationInfo }> => {
  const examenService = new ExamenService(prisma);
  const data = await examenService.getExams(
    request.structureId,
    request.page || 1,
    examenService.listLimit,
    request.sort as ExamSortField | undefined,
    request.sortDirection as 'asc' | 'desc' | undefined,
    request.keyword,
    request.status as keyof typeof ExamStatus | undefined
  );
  const count = await examenService.getFilteredExamCount(
    request.structureId,
    request.keyword,
    request.status as keyof typeof ExamStatus | undefined
  );
  const pagination = examenService.getPaginationInfo(
    count,
    examenService.listLimit
  );

  return { data, pagination };
};

export const getInitialExams = async (
  request: ExamenRequest
): Promise<{ data: ExamWithRelations[]; pagination: PaginationInfo }> => {
  request.page = 1;
  request.sort = 'requestedAt';
  request.sortDirection = 'desc';
  request.keyword = '';
  request.status = undefined;

  return await getExams(request);
};

export const getExamFullDetail = async (
  id: string,
  structureId: string
): Promise<ExamFullDetail | null> => {
  const examenService = new ExamenService(prisma);
  return await examenService.getExamFullDetail(id, structureId);
};
