import { IHistoryOptions } from '../index';

export interface IPersistenceOptions extends IHistoryOptions {
  historyFileName?: string;
  oldrecordFileName?: string;
  autoSaveInterval?: number;
}
