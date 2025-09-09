import { ExamenStatus } from '@app-test2/shared-components';
import { ListRequestType } from '@elyope/db';

export type ExamenRequest = ListRequestType & {
  structureId: string;
  status?: ExamenStatus;
};
