import { RandomAgent } from './random-agent';
import { RandomEnv } from './random-env';

import * as _ from 'lodash';

const env = new RandomEnv({
  interactionTime: 333,
});

console.log(`created environment`);

env.states.subscribe(update => {
  console.log(
    `[${update.index}]: sum: ${update.state.sum}, mean: ${update.state.mean}`
  );
});

console.log(`subscribed to updates`);

// create agents
const agents = _.range(1, 6).map(i => new RandomAgent((i * 20) - 19, i * 20));

console.log(`created agents`);

// make agents interact with the environment
agents.forEach(a => a.interactWithEnvironment(env, 100));

console.log(`made agents interact with environment`);
