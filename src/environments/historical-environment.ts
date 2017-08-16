import { Subject } from "rxjs/Subject";
import { Subscription } from "rxjs/Subscription";
import { IEnvironment, IHistorical, IHistoricalOptions, IStateUpdate, ReactiveCollection, ReactiveProperty } from "../index";

import * as _ from "lodash";

export abstract class HistoricalEnvironment<EState>
  implements
  IHistorical<IStateUpdate<EState>>,
  IEnvironment<EState> {
  public history: ReactiveCollection<IStateUpdate<EState>>;
  public state: ReactiveProperty<IStateUpdate<EState>>;
  public incomingStates: Subject<IStateUpdate<EState>>;
  public initialState: IStateUpdate<EState>;

  private subs: Subscription;

  constructor(public options: IHistoricalOptions) {
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
