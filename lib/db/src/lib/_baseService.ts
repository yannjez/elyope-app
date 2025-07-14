import { PrismaClient } from '@prisma/client';

export class BaseService {
  public prisma: PrismaClient;
  public listLimit = 20;

  constructor(protected readonly _prisma: PrismaClient) {
    this.prisma = _prisma;
  }

  getPaginationInfo = (count: number, limit: number = this.listLimit) => {
    const totalPages = Math.ceil(count / limit);
    return {
      totalPages,
    };
  };
}
