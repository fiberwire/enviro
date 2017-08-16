import { Subject } from 'rxjs/Subject';
import {
  IEnvironment,
  IEnvironmentOptions,
  IStateUpdate,
  ReactiveProperty,
} from '../index';

import { Observable, Subscription } from 'rxjs/Rx';

export abstract class DirectEnvironment<EState>
  implements IEnvironment<EState> {
  public iteration: number = 0;

  public state: ReactiveProperty<IStateUpdate<EState>>;

  public incomingStates: Subject<IStateUpdate<EState>>;

  public abstract get initialState(): IStateUpdate<EState>;

  public subs: Subscription;

  constructor(public options: IEnvironmentOptions) {
    this.state.value = this.initialState;
    this.incomingStates = new Subject();
    this.subs = new Subscription();

    this.subs.add(this.update(this.incomingStates));
  }

  public update(stateUpdates: Observable<IStateUpdate<EState>>): Subscription {
    return stateUpdates.subscribe(s => {
      this.state.value = s;
    });
  }
}
