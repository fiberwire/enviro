import { Observable, Observer, Subject, Subscription } from 'rxjs/Rx';
import { IAgentUpdate, IEnvironment, IStateUpdate } from '../../index';

export interface IAgentEnvironment<AState, EState>
  extends IEnvironment<EState> {
  inputInteractions: Observer<IAgentUpdate<AState>>;

  interactions: Observable<IAgentUpdate<AState>>;

  nextInteraction(interaction: IAgentUpdate<AState>): void;

  applyInteractions(
    interactionBuffer: Array<IAgentUpdate<AState>>
  ): IStateUpdate<EState>;

  bufferInteractions(
    interactionsPerSecond: number,
    interactions: Observable<IAgentUpdate<AState>>
  ): Observable<Array<IAgentUpdate<AState>>>;

  interact(interactions: Observable<Array<IAgentUpdate<AState>>>): Subscription;
}
