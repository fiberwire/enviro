import { RandomAgent } from './random-agent';
import { RandomEnv } from './random-env';


const env = new RandomEnv({ interactionRate: 1/2 });
console.log(`created environment`);

env.updates.subscribe(update => {
  console.log(
    `[${update.iteration}]: sum: ${update.state.sum}, mean: ${update.state
      .mean}`
  );
});
console.log(`subscribed to updates`);

const agent1 = new RandomAgent();
const agent2 = new RandomAgent();
console.log(`created agents`);

agent1.interactWithEnvironment(env);
agent2.interactWithEnvironment(env);
console.log(`made agents interact with environment`);

env.incomingInteractions.next({
  agentID: "merp",
  iteration: 1,
  state: {
    x: 100
  }
});

console.log(`sent test state`);
