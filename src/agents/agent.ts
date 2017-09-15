import { Observable, Subscription } from 'rxjs/Rx';
import { AgentEnvironment, IAgent, IAgentUpdate, IStateUpdate } from '../index';

import * as Chance from 'chance';
const chance = new Chance();

export abstract class Agent<AState, EState> implements IAgent<AState, EState> {
  public id: string;
  public interactionCount: number = 0;
  public lastInteractionIndex: number = 0;

  public get newID(): string {
    return chance.guid();
  }

  public abstract interact(state: IStateUpdate<EState>): IAgentUpdate<AState>;

  /**
   * Maps the provided state observable to an interaction observable
   * Will wait for a certain number of interactions from other agents before interacting again.
   * Setting env.options.skipInteractions to 0 will disbale this.
   *
   * @param {Observable<IStateUpdate<EState>>} state - the state of the environment
   * @returns {Observable<IAgentUpdate<AState>>} - interactions
   * @memberof Agent
   */
  public interactWithStates(
    env: AgentEnvironment<AState, EState>
  ): Observable<IAgentUpdate<AState>> {
    return env.states
      .filter(
        i =>
          env.index >=
            this.lastInteractionIndex + env.options.skipInteractions || // wait until enough other agents have interacted
          env.index < env.options.skipInteractions // unless that many interactions haven't happened yet
      )
      .map(s => this.interact(s));
  }

  /**
   * Interacts with the provided environment's state
   * by calling interactWithState() on its state property,
   * then subscribing to the resulting observable of interactions,
   * and in the subscription, sends the interaction to the environment
   * 
   * Will only interact a certain amount of time before the subscription completes.
   * set env.options.InteractionsPerAgent to <= 0 to disble this.
   *
   * @param {IAgentEnvironment<AState, EState>} env - The environment you want to interact with
   * @returns {Subscription} - The interaction subscription
   * @memberof Agent
   */
  public interactWithEnvironment(
    env: AgentEnvironment<AState, EState>
  ): Subscription {
    const countInteractions = env.agentInteractions(this.id).subscribe(i => {
      this.interactionCount += 1; // increment this.interactionCount whenever the env accepts an interaction from this agent
      this.lastInteractionIndex = i.interaction.index;
    });

    const interact = this.interactWithStates(env)
      .filter(
        i =>
          this.interactionCount < env.options.interactionsPerAgent ||
          env.options.interactionsPerAgent <= 0
      )
      .subscribe(i => {
        env.nextInteraction(i);
      });

    return interact.add(countInteractions);
  }
}
