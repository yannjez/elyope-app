import { PrismaClient } from '../../../../dist/.prisma/client/index.js';
import { PaginationInfo } from '../type/index.js';

export class BaseService {
  public prisma: PrismaClient;
  public listLimit = 20;

  constructor(protected readonly _prisma: PrismaClient) {
    this.prisma = _prisma;
  }

  getPaginationInfo = (count: number, limit: number = this.listLimit) => {
    const totalPages = Math.ceil(count / limit) || 1;
    return {
      totalPages,
    } as PaginationInfo;
  };
}
