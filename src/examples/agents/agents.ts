import { RandomAgent } from './random-agent';
import { RandomEnv } from './random-env';

const env = new RandomEnv({
  interactionTime: 1000,
  updateRate: 1000,
});

console.log(`created environment`);

env.state.subscribe(update => {
  console.log(
    `[${update.iteration}]: sum: ${update.state.sum}, mean: ${update.state
      .mean}`
  );
});

env.rejectedUpdates.subscribe(r => {
  if (r.iteration > env.iteration.value + 1) {
    console.log(
      `iteration too far in the future: ${r.iteration}, expected: ${env
        .iteration.value + 1}`
    );
  } else if (r.iteration < env.iteration.value + 1) {
    console.log(
      `iteration too late: ${r.iteration}, expected: ${env.iteration.value + 1}`
    );
  }
});

console.log(`subscribed to updates`);

const agent1 = new RandomAgent();
const agent2 = new RandomAgent();
console.log(`created agents`);

// agent1.interactWithEnvironment(env);
// agent2.interactWithEnvironment(env);
// console.log(`made agents interact with environment`);

env.nextInteraction({
  agentID: 'agents',
  iteration: 3,
  state: {
    x: 100,
  },
});
