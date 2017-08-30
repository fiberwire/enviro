import { RandomAgent } from './random-agent';
import { RandomEnv } from './random-env';

const env = new RandomEnv({
  interactionTime: 333,
});

console.log(`created environment`);

env.states.take(100).subscribe(update => {
  console.log(
    `[${update.index}]: sum: ${update.state.sum}, mean: ${update.state.mean}`
  );
});

console.log(`subscribed to updates`);

const agent1 = new RandomAgent(0, 20);
const agent2 = new RandomAgent(21, 40);
const agent3 = new RandomAgent(41, 60);
const agent4 = new RandomAgent(61, 80);
const agent5 = new RandomAgent(81, 100);
console.log(`created agents`);

agent1.interactWithEnvironment(env);
agent2.interactWithEnvironment(env);
agent3.interactWithEnvironment(env);
agent4.interactWithEnvironment(env);
agent5.interactWithEnvironment(env);
console.log(`made agents interact with environment`);

env.nextInteraction({
  agentID: 'agents',
  index: 3,
  state: {
    x: 100,
  },
});
