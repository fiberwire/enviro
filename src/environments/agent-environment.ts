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
} from '../index';

export abstract class AgentEnvironment<
  AState,
  EState
> extends DirectEnvironment<EState>
  implements IAgentEnvironment<AState, EState> {
  public incomingInteractions: Subject<IAgentUpdate<AState>>;

  public get bufferedInteractions(): Observable<Array<IAgentUpdate<AState>>> {
    return this.bufferInteractions(
      this.options.interactionRate,
      this.incomingInteractions
    );
  }

  constructor(public options: IEnvironmentOptions) {
    super(options);

    this.incomingInteractions = new Subject<IAgentUpdate<AState>>();

    this.subs.add(this.interact(this.bufferedInteractions));
  }

  public abstract applyInteractions(
    interactionBuffer: Array<IAgentUpdate<AState>>
  ): IStateUpdate<EState>;

  public interact(
    interactions: Observable<Array<IAgentUpdate<AState>>>
  ): Subscription {
    return interactions
      .map(buffer => this.applyInteractions(buffer))
      .subscribe(i => this.next(i));
  }

  public bufferInteractions(
    interactionsPerSecond: number,
    interactions: Observable<IAgentUpdate<AState>>
  ): Observable<Array<IAgentUpdate<AState>>> {
    return this.incomingInteractions
      .filter(i => i.iteration === this.iteration.value + 1) // only accept new interactions
      .bufferTime(1000 / interactionsPerSecond) // buffer new interactions periodically
      .filter(i => i.length > 0); // do notihng if there are no interactions
  }
}
