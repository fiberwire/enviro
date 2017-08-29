import { AgentEnvironment, IAgentUpdate, IStateUpdate } from '../../index';

import * as _ from 'lodash';
import { IRandomAState } from './random-astate';
import { IRandomEState } from './random-estate';

export class RandomEnv extends AgentEnvironment<IRandomAState, IRandomEState> {
  public applyInteractions(
    interactionBuffer: Array<IAgentUpdate<IRandomAState>>
  ): IStateUpdate<IRandomEState> {
    const chosen = _.shuffle(interactionBuffer)[0];
    const state = this.state.value.state;

    const mean = (state.mean + chosen.state.x) / 2;
    const sum = state.sum + chosen.state.x;

    return {
      iteration: chosen.iteration,
      state: {
        mean,
        sum,
      },
    };
  }
  public get defaultState(): IRandomEState {
    return {
      mean: 0,
      sum: 0,
    };
  }
}
