import { Observable } from 'rxjs/Rx';
import { Agent, IAgent, IAgentUpdate, IStateUpdate } from '../../index';
import { IRandomAState } from './random-astate';
import { IRandomEState } from './random-estate';

import * as Chance from 'chance';
const chance = new Chance();

export class RandomAgent extends Agent<IRandomAState, IRandomEState> {
  constructor(public min: number, public max: number, id?: string) {
    super(id);
  }

  public interact(
    state: IStateUpdate<IRandomEState>
  ): IAgentUpdate<IRandomAState> {
    return {
      agentID: this.id,
      index: state.index + 1,
      state: {
        x: chance.integer({ min: this.min, max: this.max }),
      },
    };
  }
}
