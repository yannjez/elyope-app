import { BaseFilter } from './Base';

export type ExamenStatus =
  | 'pending'
  | 'processing'
  | 'completed'
  | 'archived'
  | 'cancelled';

export type Examen = {
  id: string;
  createdAt: string;
  status: ExamenStatus;
  data: ExmansData;
};

export type ExmansData = {
  animalId: string;
};

export type ExamenFilter = BaseFilter & {
  status?: ExamenStatus;
};
