import { IHistoryOptions, ReactiveCollection } from '../index';

export interface IHistory<T> {
  history: ReactiveCollection<T>;
  length: number;
  options: IHistoryOptions

  newest: T;
  oldest: T;

  filter(f: (value: T) => boolean): T[];
  handleOldRecords(value: T): T;
  record(value: T): T;
  remove(value: T): T;
}
