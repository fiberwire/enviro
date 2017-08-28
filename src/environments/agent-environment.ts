import { Observable, Observer, Scheduler, Subject, Subscription } from 'rxjs';
import { DirectEnvironment } from './direct-environment';

import * as _ from 'lodash';
import {
  IAgentEnvironment,
  IAgentEnvironmentOptions,
  IAgentUpdate,
  IEnvironment,
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
  > extends DirectEnvironment<EState>
  implements IAgentEnvironment<AState, EState> {

  /**
   * This is where to send new interactions
   * 
   * @readonly
   * @type {Observer<IAgentUpdate<AState>>}
   * @memberof AgentEnvironment
   */
  public get inputInteractions(): Observer<IAgentUpdate<AState>> {
    return this.incomingInteractions;
  }


  /**
   * An observable of new interactions that have yet to be applied to the Environment's state
   * 
   * @readonly
   * @type {Observable<IAgentUpdate<AState>>}
   * @memberof AgentEnvironment
   */
  public get interactions(): Observable<IAgentUpdate<AState>> {
    return this.incomingInteractions;
  }


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
      this.interactions
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

    this.subs.add(this.interact(this.bufferedInteractions));
  }


  /**
   * Takes an interaction buffer and returns a new state update
   * 
   * @abstract
   * @param {Array<IAgentUpdate<AState>>} interactionBuffer - the interaction buffer to apply to state
   * @returns {IStateUpdate<EState>} 
   * @memberof AgentEnvironment
   */
  public abstract applyInteractions(
    interactionBuffer: Array<IAgentUpdate<AState>>
  ): IStateUpdate<EState>;


  /**
   * Sends an interaction to the Environment
   * 
   * @param {IAgentUpdate<AState>} interaction - the interaction you are sending to the environment
   * @memberof AgentEnvironment
   */
  public nextInteraction(interaction: IAgentUpdate<AState>): void {
    this.inputInteractions.next(interaction);
  }


  /**
   * Takes a stream of interaction buffers, applies them as they come in, and sends the resulting state updates to the Environment
   * 
   * @param {Observable<Array<IAgentUpdate<AState>>>} bufferedInteractions - a stream of interaction buffers to apply
   * @returns {Subscription} 
   * @memberof AgentEnvironment
   */
  public interact(
    bufferedInteractions: Observable<Array<IAgentUpdate<AState>>>
  ): Subscription {
    return bufferedInteractions
      .map(buffer => this.applyInteractions(buffer))
      .subscribe(i => this.nextState(i));
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
      .filter(i => i.iteration === this.iteration.value + 1) // only accept new interactions
      .bufferTime(1000 / interactionTime) // buffer new interactions periodically
      .filter(i => i.length > 0); // do nothing if there are no interactions
  }
}
