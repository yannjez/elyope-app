'use server';

import { prisma } from '@/db';
import {
  ExamWithRelations,
  ExamenService,
  PaginationInfo,
  ExamSortField,
  ExamStatus,
  ExamFullDetail,
  AnimalService,
} from '@elyope/db';
import { getLocale } from 'next-intl/server';

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
  const locale = await getLocale();
  const examenService = new ExamenService(prisma);
  return await examenService.getExamFullDetail(
    id,
    structureId,
    locale?.includes('en') ? 'en' : 'fr'
  );
};

export const updateExam = async (
  id: string,
  input: Partial<{
    status: keyof typeof ExamStatus;
    requestedAt: Date;
    vetReference: string;
    animalId: string;
    requestReason: string;
    history: string;
    clinicalExams: string;
    manifestationCategory: string;
    paroxysmalSubtype: string;
    manifestationOther: string;
    firstManifestationAt: Date;
    lastManifestationAt: Date;
    manifestationDescription: string;
    manifestationFrequency: string;
    avgManifestationDurationMin: number;
    clinicalSuspicion: string;
    currentAntiepilepticTreatments: string;
    otherTreatments: string;
    examCondition: string;
    sedationProtocol: string;
    eegSpecificEvents: string;
    duringExamClinical: string;
    comments: string;
  }>
) => {
  const examenService = new ExamenService(prisma);
  return await examenService.updateExam(id, input);
};

export const searchAnimalsForExamen = async (
  structureId: string,
  keyword?: string,
  limit = 10
) => {
  const animalService = new AnimalService(prisma);
  return await animalService.getAnimals(
    structureId,
    1,
    limit,
    'name',
    'asc',
    keyword,
    undefined,
    'fr'
  );
};
