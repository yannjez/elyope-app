import { ExamStatus, Prisma, PrismaClient } from '@prisma/client';
import { BaseService } from './_baseService.js';
import { ExamSortField, CanDeleteExamReason } from '../type/index.js';

export class ExamenService extends BaseService {
  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  canDeleteExam = async (
    structureId: string,
    id: string
  ): Promise<{ canDelete: boolean; reason: CanDeleteExamReason }> => {
    // Check if there are attachments or additional tests linked to the exam
    const attachmentsCount = await this.prisma.examAttachment.count({
      where: { examId: id },
    });

    const additionalTestsCount = await this.prisma.examAdditionalTest.count({
      where: { examId: id },
    });

    const reason: CanDeleteExamReason = {
      linkedAttachments: attachmentsCount > 0,
      linkedAdditionalTests: additionalTestsCount > 0,
    };

    return {
      canDelete: attachmentsCount === 0 && additionalTestsCount === 0,
      reason,
    };
  };

  deleteExam = async (structureId: string, id: string) => {
    const exam = await this.prisma.exam.findFirst({
      where: { id: id, structureId: structureId },
    });

    if (!exam) {
      throw new Error('Exam not found');
    }

    await this.prisma.exam.delete({
      where: { id: id },
    });
  };

  createExam = async (input: Prisma.ExamCreateInput) => {
    return await this.prisma.exam.create({
      data: input,
      include: {
        animal: {
          include: {
            breed: true,
          },
        },
        structure: true,
        interpreter: true,
        attachments: true,
        additionalTests: true,
      },
    });
  };

  updateExam = async (id: string, input: Prisma.ExamUpdateInput) => {
    return await this.prisma.exam.update({
      where: { id },
      data: input,
      include: {
        animal: {
          include: {
            breed: true,
          },
        },
        structure: true,
        interpreter: true,
        attachments: true,
        additionalTests: true,
      },
    });
  };

  getExamById = async (id: string, structureId: string) => {
    return await this.prisma.exam.findFirst({
      where: { id, structureId },
      include: {
        animal: {
          include: {
            breed: true,
          },
        },
        structure: true,
        interpreter: true,
        attachments: true,
        additionalTests: true,
      },
    });
  };

  getExams = async (
    structureId: string,
    page: number,
    limit: number,
    sort?: ExamSortField,
    sortDirection?: 'asc' | 'desc',
    search?: string,
    status?: ExamStatus
  ) => {
    const offset = (page - 1) * limit;

    const where = this.buildSearchWhere(structureId, search, status);
    const direction = sortDirection === 'asc' ? 'asc' : 'desc';
    const sortableFields: Record<string, Prisma.ExamOrderByWithRelationInput> =
      {
        requestedAt: { requestedAt: direction },
        status: { status: direction },
        vetReference: { vetReference: direction },
        animalName: { animal: { name: direction } },
        structureName: { structure: { name: direction } },
      };

    const orderBy = (sort && sortableFields[sort]) || { requestedAt: 'desc' };

    return await this.prisma.exam.findMany({
      where,
      include: {
        animal: {
          include: {
            breed: true,
          },
        },
        structure: true,
        interpreter: true,
        attachments: true,
        additionalTests: true,
      },
      skip: offset,
      take: limit,
      orderBy: orderBy,
    });
  };

  /**
   * Return count of exams matching optional keyword search
   */
  getFilteredExamCount = async (
    structureId?: string,
    search?: string,
    status?: ExamStatus
  ) => {
    const where = this.buildSearchWhere(structureId, search, status);
    const count = await this.prisma.exam.count({
      where: where as Prisma.ExamWhereInput,
    });
    return count;
  };

  /**
   * Build a Prisma where clause for keyword search across multiple fields
   */
  private buildSearchWhere(
    structureId?: string,
    keyword?: string,
    status?: ExamStatus
  ) {
    const where = {
      structureId: structureId,
    } as Prisma.ExamWhereInput;

    if (status) {
      where.status = status;
    }

    const query = keyword?.trim();
    if (query) {
      where.OR = [
        { vetReference: { contains: query, mode: 'insensitive' } },
        { animal: { name: { contains: query, mode: 'insensitive' } } },
        { requestReason: { contains: query, mode: 'insensitive' } },
        { clinicalSuspicion: { contains: query, mode: 'insensitive' } },
        { comments: { contains: query, mode: 'insensitive' } },
      ];
    }
    return where;
  }
}
