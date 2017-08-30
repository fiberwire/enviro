import {
  History,
  IEnvironmentOptions,
  IHistoryOptions,
  IPersistenceOptions,
  IStateUpdate,
  ReactiveCollection,
  ReactiveProperty,
} from '../index';
import { DirectEnvironment } from './direct-environment';

import * as _ from 'lodash';
import { Observable, Subject, Subscription } from 'rxjs/Rx';

export abstract class HistoricalEnvironment<EState> extends DirectEnvironment<
  EState
> {
  public history: History<IStateUpdate<EState>>;

  constructor(
    public options: IEnvironmentOptions,
    public historyOptions: IHistoryOptions
  ) {
    super(options);

    this.history = new History(historyOptions);

    this.subs.add(this.recordHistory());
  }

  private recordHistory(): Subscription {
    return this.states.subscribe(s => {
      this.history.record(s);
    });
  }
}
