import { DirectEnvironment, IStateUpdate } from '../index';

// define shape of state
interface IHelloState {
  message: string;
  name: string;
}

// extend environment class, passing in state interface as a type parameter
class HelloEnv extends DirectEnvironment<IHelloState> {
  public get defaultState(): IHelloState {
    return {
      message: '',
      name: '',
    };
  }
}

// create new env
const env = new HelloEnv({ interactionRate: 1 });

// subscribe to env updates
env.updates.take(1).subscribe(s => {
  console.log(`${s.state.message}, ${s.state.name}!`);
});

// send new states to env
env.next({
  iteration: 1,
  state: {
    message: 'Hello',
    name: 'World',
  },
});
