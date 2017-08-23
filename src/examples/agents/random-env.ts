import { AgentEnvironment, IAgentUpdate, IStateUpdate } from '../../index';

import * as _ from 'lodash';
import { IRandomAState } from './random-astate';
import { IRandomEState } from './random-estate';

export class RandomEnv extends AgentEnvironment<IRandomAState, IRandomEState> {
  public applyInteractions(
    interactionBuffer: Array<IAgentUpdate<IRandomAState>>
  ): IStateUpdate<IRandomEState> {
    const state = _.shuffle(interactionBuffer)[0];

    const sum = this.state.value.state.sum + state.state.x;
    const mean = (this.state.value.state.mean + state.state.x) / 2;

    return {
      iteration: state.iteration,
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
