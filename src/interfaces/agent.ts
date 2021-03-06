import { Observable, Observer, Subscription } from 'rxjs/Rx';
import { AgentEnvironment, IAgentUpdate, IStateUpdate } from '../index';

export interface IAgent<AState, EState> {
  id: string;
  interactionCount: number;

  /**
   * takes the state of the environment and returns an interaction
   *
   * @param {IStateUpdate<EState>} state - state of the environment
   * @returns {IAgentUpdate<AState>} - interaction
   * @memberof IAgent
   */
  interact(state: IStateUpdate<EState>): IAgentUpdate<AState>;

  /**
   * Takes an observable of states and interacts with them as they come in
   *
   * @param {Observable<IStateUpdate<EState>>} state
   * @returns {Observable<IAgentUpdate<AState>>}
   * @memberof IAgent
   */
  interactWithStates(
    env: AgentEnvironment<AState, EState>
  ): Observable<IAgentUpdate<AState>>;

  /**
   * Takes an environment, interacts with its state,
   * and returns the subscription for the interaction
   *
   * @param {IAgentEnvironment<AState, EState>} env - The environment you want to interact with
   * @returns {Subscription} - the interaction subscription
   * @memberof IAgent
   */
  interactWithEnvironment(
    env: AgentEnvironment<AState, EState>,
    interactions: number
  ): Subscription;
}
