import { PrismaClient } from '../../../../dist/.prisma/client/index.js';
import { BaseService } from './_baseService.js';

export class StructureService extends BaseService {
  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  /**
   * Create a new structure with interpreter validation
   */
  // async createStructure(data: {
  //   name: string;
  //   externalId: string;
  //   interpreterId?: string;
  // }) {
  //   // If an interpreter is provided, validate they have the INTERPRETER role
  //   if (data.interpreterId) {
  //     const interpreter = await this.prisma.user.findUnique({
  //       where: { id: data.interpreterId },
  //       select: { role: true },
  //     });

  //     if (!interpreter) {
  //       throw new Error('Interpreter not found');
  //     }

  //     if (interpreter.role !== 'INTERPRETER') {
  //       throw new Error(
  //         'Only users with INTERPRETER role can be assigned as interpreters'
  //       );
  //     }
  //   }

  //   return this.prisma.structure.create({
  //     data: {
  //       name: data.name,
  //       externalId: data.externalId,
  //       interpreterId: data.interpreterId,
  //     },
  //     include: {
  //       Interpreter: true,
  //       Members: {
  //         include: {
  //           user: true,
  //         },
  //       },
  //     },
  //   });
  // }

  // /**
  //  * Update a structure with interpreter validation
  //  */
  // async updateStructure(
  //   id: string,
  //   data: {
  //     name?: string;
  //     externalId?: string;
  //     interpreterId?: string;
  //   }
  // ) {
  //   // If an interpreter is being updated, validate they have the INTERPRETER role
  //   if (data.interpreterId !== undefined) {
  //     if (data.interpreterId) {
  //       const interpreter = await this.prisma.user.findUnique({
  //         where: { id: data.interpreterId },
  //         select: { role: true },
  //       });

  //       if (!interpreter) {
  //         throw new Error('Interpreter not found');
  //       }

  //       if (interpreter.role !== 'INTERPRETER') {
  //         throw new Error(
  //           'Only users with INTERPRETER role can be assigned as interpreters'
  //         );
  //       }
  //     }
  //   }

  //   return this.prisma.structure.update({
  //     where: { id },
  //     data,
  //     include: {
  //       Interpreter: true,
  //       Members: {
  //         include: {
  //           user: true,
  //         },
  //       },
  //     },
  //   });
  // }

  /**
   * Get all users with INTERPRETER role for dropdown/selection
   */
  // async getInterpreters() {
  //   return this.prisma.user.findMany({
  //     where: { role: 'INTERPRETER' },
  //     select: {
  //       id: true,
  //       name: true,
  //       email: true,
  //     },
  //   });
  // }

  async getStructureById(id: string) {
    return this.prisma.structure.findUnique({
      where: { id },
      include: {
        Interpreter: true,
        Members: {
          include: {
            user: true,
          },
        },
      },
    });
  }
}
