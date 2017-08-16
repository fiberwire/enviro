import { Subject } from "rxjs/Subject";
import { IEnvironmentOptions, IStateUpdate, ReactiveProperty } from "../index";

export interface IEnvironment<EState> {
  state: ReactiveProperty<IStateUpdate<EState>>;
  incomingStates: Subject<IStateUpdate<EState>>;
  options: IEnvironmentOptions;
  initialState: IStateUpdate<EState>;
}
