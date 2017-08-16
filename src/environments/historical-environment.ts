import {
  History,
  IEnvironment,
  IHistorical,
  IHistoricalOptions,
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
  > implements IHistorical<IStateUpdate<EState>>, IEnvironment<EState> {
  public history: History<IStateUpdate<EState>>;
  public state: ReactiveProperty<IStateUpdate<EState>>;
  public incomingStates: Subject<IStateUpdate<EState>>;
  public initialState: IStateUpdate<EState>;

  constructor(public options: IHistoricalOptions, public historyOptions: IHistoryOptions) {
    super(options);

    this.history = new History(historyOptions);

    this.subs.add(this.recordHistory());
  }

  private recordHistory(): Subscription {
    return this.state
      .subscribe(s => {
        this.history.record(s);
      });
  }
}
