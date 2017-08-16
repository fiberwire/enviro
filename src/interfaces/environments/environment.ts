import { Observable, Subject, Subscription } from "rxjs/Rx";
import { IEnvironmentOptions, IStateUpdate, ReactiveProperty } from '../../index';

export interface IEnvironment<EState> {
  state: ReactiveProperty<IStateUpdate<EState>>;
  incomingStates: Subject<IStateUpdate<EState>>;
  options: IEnvironmentOptions;
  initialState: IStateUpdate<EState>;
  iteration: number;

  update(stateUpdates: Observable<IStateUpdate<EState>>): Subscription;
}
