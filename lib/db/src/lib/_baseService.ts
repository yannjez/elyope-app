import { PrismaClient } from '@prisma/client';

export class BaseService {
  public prisma: PrismaClient;

  constructor(protected readonly _prisma: PrismaClient) {
    this.prisma = _prisma;
  }
}
