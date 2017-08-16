import { Observable, Observer, Subscription } from "rxjs/Rx";
import {
  IAgentUpdate,
  IInteraction,
  IStateUpdate,
} from "../index";

export interface IAgent<AState, EState> {
  interact(state: IStateUpdate<EState>): Promise<IAgentUpdate<AState>>;

  interactWithEnvironment(
    state: Observable<IStateUpdate<EState>>,
    env: Observer<IInteraction<AState, EState>>): Observable<IInteraction<AState, EState>>;
}
