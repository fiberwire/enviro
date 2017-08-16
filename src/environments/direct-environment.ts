
import { Subject } from "rxjs/Subject";
import { IEnvironment, IStateUpdate, ReactiveProperty } from "../index";

export class DirectEnvironment<EState>
implements
IEnvironment<EState> {
  public state: ReactiveProperty<IStateUpdate<EState>>;
  public incomingStates: Subject<IStateUpdate<EState>>;

}
