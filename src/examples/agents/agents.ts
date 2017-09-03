import { RandomAgent } from './random-agent';
import { RandomEnv } from './random-env';

import * as _ from 'lodash';

const env = new RandomEnv({
  interactionTime: 1 / 600,
  interactionsPerAgent: 100,
  skipInteractions: 1,
});

console.log(`created environment`);

env.states.subscribe(update => {
  console.log(
    `[${update.index}]: sum: ${update.state.sum} = ${update.state
      .previousSum} + ${update.state.x}, mean: ${update.state.mean}`
  );
});

console.log(`subscribed to updates`);

// create agents
const agents = _.range(50).map(
  i => new RandomAgent((i + 1) * 20 - 19, (i + 1) * 20)
);

console.log(`created agents`);

// make agents interact with the environment
agents.forEach(a => a.interactWithEnvironment(env));

console.log(`made agents interact with environment`);
