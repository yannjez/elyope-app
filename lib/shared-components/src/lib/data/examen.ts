import { ExamenStatus } from '../types/Examens';

export const examenClassName: Record<ExamenStatus, [string, string]> = {
  pending: ['bg-el-blue-200 ', 'bg-el-blue-500'],
  processing: ['bg-el-yellow-300', 'bg-el-yellow-500'],
  completed: ['bg-el-green-300 ', 'bg-el-green-500'],
  archived: ['bg-el-grey-00 ', 'bg-el-grey-400'],
};
