import { IHistory } from '../../index';
import { ReactiveCollection } from '../../reactive-collection';

export interface IHistoricalEnvironment<T> {
  history: IHistory<T>;
}
