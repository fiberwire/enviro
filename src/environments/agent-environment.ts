import { Observable, Scheduler, Subject, Subscription } from 'rxjs';
import { DirectEnvironment } from './direct-environment';

import * as _ from 'lodash';
import {
  IAgentEnvironment,
  IAgentUpdate,
  IEnvironment,
  IEnvironmentOptions,
  IInteraction,
  IStateUpdate,
  ReactiveCollection,
  ReactiveProperty,
  IAgentEnvironmentOptions,
} from '../index';

export abstract class AgentEnvironment<
  AState,
  EState
> extends DirectEnvironment<EState>
  implements IAgentEnvironment<AState, EState> {
  public inputInteractions: Subject<IAgentUpdate<AState>>;

  public get bufferedInteractions(): Observable<Array<IAgentUpdate<AState>>> {
    return this.bufferInteractions(
      this.options.interactionTime,
      this.inputInteractions
    );
  }

  constructor(public options: IAgentEnvironmentOptions) {
    super(options);

    this.inputInteractions = new Subject<IAgentUpdate<AState>>();

    this.subs.add(this.interact(this.bufferedInteractions));
  }

  public abstract applyInteractions(
    interactionBuffer: Array<IAgentUpdate<AState>>
  ): IStateUpdate<EState>;

  public nextInteraction(interaction: IAgentUpdate<AState>): void {
    this.inputInteractions.next(interaction);
  }

  public interact(
    bufferedInteractions: Observable<Array<IAgentUpdate<AState>>>
  ): Subscription {
    return bufferedInteractions
      .map(buffer => this.applyInteractions(buffer))
      .subscribe(i => this.nextState(i));
  }

  public bufferInteractions(
    interactionsPerSecond: number,
    interactions: Observable<IAgentUpdate<AState>>
  ): Observable<Array<IAgentUpdate<AState>>> {
    return this.inputInteractions
      .filter(i => i.iteration === this.iteration.value + 1) // only accept new interactions
      .bufferTime(1000 / interactionsPerSecond) // buffer new interactions periodically
      .filter(i => i.length > 0); // do nothing if there are no interactions
  }
}
