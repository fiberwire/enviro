import { IHistory } from "../index";
import { ReactiveCollection } from '../reactive-collection';

export interface IHistorical<T> {
  history: IHistory<T>;
}
