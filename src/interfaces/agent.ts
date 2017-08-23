import { Observable, Observer, Subscription } from 'rxjs/Rx';
import { IAgentUpdate, IInteraction, IStateUpdate } from '../index';

export interface IAgent<AState, EState> {
  id: string;
  interact(state: IStateUpdate<EState>): IAgentUpdate<AState>;

  interactWithState(
    state: Observable<IStateUpdate<EState>>
  ): Observable<IAgentUpdate<AState>>;
}
