import { Observable, Observer, Scheduler, Subject, Subscription } from 'rxjs';
import { DirectEnvironment } from './direct-environment';

import * as _ from 'lodash';
import {
  IAgentEnvironmentOptions,
  IAgentUpdate,
  IEnvironmentOptions,
  IInteraction,
  IStateUpdate,
  ReactiveCollection,
  ReactiveProperty,
} from '../index';

/**
 * An Environment whose state is updated indirectly by sending interactions to it
 *
 * @export
 * @abstract
 * @class AgentEnvironment
 * @extends {DirectEnvironment<EState>}
 * @implements {IAgentEnvironment<AState, EState>}
 * @template AState - The Agent state type
 * @template EState - The Environment state type
 */
export abstract class AgentEnvironment<
  AState,
  EState
> extends DirectEnvironment<EState> {

  /**
   * Buffers this.interactions based on this.options.interactionTime
   *
   * @readonly
   * @type {Observable<Array<IAgentUpdate<AState>>>}
   * @memberof AgentEnvironment
   */
  public get bufferedInteractions(): Observable<Array<IAgentUpdate<AState>>> {
    return this.bufferInteractions(
      this.options.interactionTime,
      this.incomingInteractions
    );
  }

  /**
   * This is where you send new interactions
   *
   * @private
   * @type {Subject<IAgentUpdate<AState>>}
   * @memberof AgentEnvironment
   */
  private incomingInteractions: Subject<IAgentUpdate<AState>> = new Subject();

  /**
   * Creates an instance of AgentEnvironment.
   * @param {IAgentEnvironmentOptions} options - contains options to set up the Environment
   * @memberof AgentEnvironment
   */
  constructor(public options: IAgentEnvironmentOptions) {
    super(options);

    this.subs.add(this.interaction(this.bufferedInteractions));
  }

  public abstract async interact(interaction: IAgentUpdate<AState>):Promise<IStateUpdate<EState>>;

  /**
   * Takes an interaction buffer and returns a new state update
   *
   * @param {Array<IAgentUpdate<AState>>} interactionBuffer - the interaction buffer to apply to state
   * @returns {IStateUpdate<EState>}
   * @memberof AgentEnvironment
   */
  public async applyInteractions(
    interactionBuffer: Array<IAgentUpdate<AState>>
  ): Promise<IStateUpdate<EState>> {
    const chosen = _.shuffle(interactionBuffer)[0];
    return await this.interact(chosen);
  }

  /**
   * Sends an interaction to the Environment
   *
   * @param {IAgentUpdate<AState>} interaction - the interaction you are sending to the environment
   * @memberof AgentEnvironment
   */
  public nextInteraction(interaction: IAgentUpdate<AState>): void {
    this.incomingInteractions.next(interaction);
  }

  /**
   * Takes a stream of interaction buffers, applies them as they come in, and sends the resulting state updates to the Environment
   *
   * @param {Observable<Array<IAgentUpdate<AState>>>} bufferedInteractions - a stream of interaction buffers to apply
   * @returns {Subscription}
   * @memberof AgentEnvironment
   */
  public interaction(
    bufferedInteractions: Observable<Array<IAgentUpdate<AState>>>
  ): Subscription {
    return bufferedInteractions
      .map(buffer => this.applyInteractions(buffer))
      .observeOn(Scheduler.asap)
      .subscribe(async i => this.nextState(await i));
  }

  /**
   * Buffers interactions based on interactionTime
   *
   * @param {number} interactionTime - time per interaction buffer
   * @param {Observable<IAgentUpdate<AState>>} interactions - interactions to buffer over time
   * @returns {Observable<Array<IAgentUpdate<AState>>>}
   * @memberof AgentEnvironment
   */
  public bufferInteractions(
    interactionTime: number,
    interactions: Observable<IAgentUpdate<AState>>
  ): Observable<Array<IAgentUpdate<AState>>> {
    return this.incomingInteractions
      .filter(i => i.index === this.index + 1) // only accept new interactions
      .bufferTime(interactionTime) // buffer new interactions periodically
      .filter(i => i.length > 0) // do nothing if there are no interactions
      .observeOn(Scheduler.asap);
  }
}
