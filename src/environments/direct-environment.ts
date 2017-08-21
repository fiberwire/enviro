import { Subject } from 'rxjs/Subject';
import {
  IEnvironment,
  IEnvironmentOptions,
  IStateUpdate,
  ReactiveProperty,
} from '../index';

import { Observable, Observer, Subscription } from 'rxjs/Rx';

export abstract class DirectEnvironment<EState>
  implements IEnvironment<EState> {
  public iteration: ReactiveProperty<number>;

  public state: ReactiveProperty<IStateUpdate<EState>> = new ReactiveProperty();

  public get input(): Observer<IStateUpdate<EState>> {
    return this.incomingStates;
  }

  public get updates(): Observable<IStateUpdate<EState>> {
    return this.incomingStates;
  }

  public abstract get defaultState(): EState;

  public get initialState(): IStateUpdate<EState> {
    return {
      iteration: 0,
      state: this.defaultState,
    };
  }

  public subs: Subscription;

  private incomingStates: Subject<IStateUpdate<EState>> = new Subject();

  constructor(public options: IEnvironmentOptions) {
    this.reset();
    this.iteration = new ReactiveProperty(this.state.value.iteration);

    this.subs = new Subscription();

    this.subs.add(this.update(this.updates));
  }

  public next(state: IStateUpdate<EState>): void {
    this.input.next(state);
  }

  public update(stateUpdates: Observable<IStateUpdate<EState>>): Subscription {
    return stateUpdates.subscribe(s => {
      this.state.value = s;
    });
  }

  // resets the environment back to a fresh state
  public reset(): void {
    this.state.value = this.initialState;
  }
}
