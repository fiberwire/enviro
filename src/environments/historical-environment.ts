import {
  IEnvironment,
  IHistorical,
  IHistoricalOptions,
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
  public history: ReactiveCollection<IStateUpdate<EState>>;
  public state: ReactiveProperty<IStateUpdate<EState>>;
  public incomingStates: Subject<IStateUpdate<EState>>;
  public initialState: IStateUpdate<EState>;

  constructor(public options: IHistoricalOptions) {
    super(options);

    this.history = new ReactiveCollection();

    this.subs.add(this.recordHistory());
  }

  private recordHistory(): Subscription {
    return this.state.subscribe(s => {
      this.history.push(s);

      if (this.history.value.length > this.options.historyLength) {
        this.history.value = _.takeRight(
          this.history.value,
          this.options.historyLength
        );
      }
    });
  }
}
