import { Observable, Subscription } from 'rxjs/Rx';
import { AgentEnvironment, IAgent, IAgentUpdate, IStateUpdate } from '../index';

import * as Chance from 'chance';
const chance = new Chance();

export abstract class Agent<AState, EState> implements IAgent<AState, EState> {
  public id: string;

  public get newID(): string {
    return chance.guid();
  }

  /**
   * Creates an instance of Agent.
   *
   * @param {string} [id] - A unique identifier for this Agent. If one is not provided, a random id will be generated
   * @memberof Agent
   */
  constructor(id?: string) {
    this.id = id || this.newID;
  }

  public abstract interact(state: IStateUpdate<EState>): IAgentUpdate<AState>;

  /**
   * Maps the provided state observable to an interaction observable
   *
   * @param {Observable<IStateUpdate<EState>>} state - the state of the environment
   * @returns {Observable<IAgentUpdate<AState>>} - interactions
   * @memberof Agent
   */
  public interactWithState(
    state: Observable<IStateUpdate<EState>>
  ): Observable<IAgentUpdate<AState>> {
    return state.map(s => this.interact(s));
  }

  /**
   * Interacts with the provided environment's state
   * by calling interactWithState() on its state property,
   * then subscribing to the resulting observable of interactions,
   * and in the subscription, sends the interaction to the environment
   *
   * @param {IAgentEnvironment<AState, EState>} env - The environment you want to interact with
   * @returns {Subscription} - The interaction subscription
   * @memberof Agent
   */
  public interactWithEnvironment(
    env: AgentEnvironment<AState, EState>
  ): Subscription {
    return this.interactWithState(env.states).subscribe(i => {
      env.nextInteraction(i);
    });
  }
}
