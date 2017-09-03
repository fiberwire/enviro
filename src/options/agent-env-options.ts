import { IEnvironmentOptions } from '../index';

export interface IAgentEnvironmentOptions extends IEnvironmentOptions {
  /**
   * In seconds.
   * Determines how long the environment will listen for interactions before applying interactions to its state
   *
   * @type {number}
   * @memberof IAgentEnvironmentOptions
   */
  interactionTime: number;

  /**
   * Determines how many interactions each agent will perform
   * interactions only count if they are applied by the environment
   *
   * @type {number}
   * @memberof IAgentEnvironmentOptions
   */
  interactionsPerAgent: number;

  /**
   * determines how many interactions each agent will skip before sending an interaction to the state.
   * since interactions are chosen randomly to be applied to the env state, this has the effect of
   * increasing the odds for each other agent of having their interaction applied.
   *
   * If you set this to the number of agents minus one, it is essentially like the agents take turns
   * after the first round of interactions, which would be random
   *
   * @type {number}
   * @memberof IAgentEnvironmentOptions
   */
  skipInteractions: number;
}
