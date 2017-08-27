import { Observable, Observer, Subject, Subscription } from 'rxjs/Rx';
import {
  IEnvironmentOptions,
  IStateUpdate,
  ReactiveProperty,
} from '../../index';

export interface IEnvironment<EState> {
  state: ReactiveProperty<IStateUpdate<EState>>;
  inputStates: Observer<IStateUpdate<EState>>;
  updates: Observable<IStateUpdate<EState>>;
  options: IEnvironmentOptions;
  defaultState: EState;
  initialState: IStateUpdate<EState>;
  iteration: ReactiveProperty<number>;

  nextState(state: IStateUpdate<EState>): void;
  update(stateUpdates: Observable<IStateUpdate<EState>>): Subscription;
  reset(): void;
}
