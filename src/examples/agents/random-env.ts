import { AgentEnvironment, IAgentUpdate, IStateUpdate } from '../../index';

import * as _ from 'lodash';
import { IRandomAState } from './random-astate';
import { IRandomEState } from './random-estate';

export class RandomEnv extends AgentEnvironment<IRandomAState, IRandomEState> {
  public async interact(
    interaction: IAgentUpdate<IRandomAState>
  ): Promise<IStateUpdate<IRandomEState>> {
    const state = this.currentState.state;

    const xs = [...state.xs, interaction.state.x];
    const mean = _.mean(xs);
    const sum = _.sum(xs);
    const previousSum = state.sum;
    const x = interaction.state.x;

    return Promise.resolve({
      index: interaction.index,
      state: {
        mean,
        previousSum,
        sum,
        x,
        xs,
      },
    });
  }

  public get defaultState(): IRandomEState {
    return {
      mean: 0,
      previousSum: 0,
      sum: 0,
      x: 0,
      xs: [],
    };
  }
}
