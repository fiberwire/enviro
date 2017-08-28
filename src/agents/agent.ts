import { Observable, Subscription } from 'rxjs/Rx';
import {
  IAgent,
  IAgentEnvironment,
  IAgentUpdate,
  IStateUpdate,
} from '../index';

import * as Chance from 'chance';
const chance = new Chance();

export abstract class Agent<AState, EState> implements IAgent<AState, EState> {
  public id: string;

  public get newID(): string {
    return chance.guid();
  }

  constructor(id?: string) {
    this.id = id || this.newID;
  }
  public abstract interact(state: IStateUpdate<EState>): IAgentUpdate<AState>;

  public interactWithState(
    state: Observable<IStateUpdate<EState>>
  ): Observable<IAgentUpdate<AState>> {
    return state.map(s => this.interact(s));
  }

  public interactWithEnvironment(
    env: IAgentEnvironment<AState, EState>
  ): Subscription {
    return this.interactWithState(env.updates).subscribe(i => {
      env.incomingInteractions.next(i);
    });
  }
}
