import { Observable } from "rxjs/Rx";
import { DirectEnvironment, IStateUpdate } from '../../index';

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
const env = new HelloEnv({});

// subscribe to env updates
env.states
  .filter(s => s.index > 0)
  .subscribe(s => {
    console.log(`${s.state.message}, ${s.state.name}!`);
  });

Observable.interval(1000)
  .subscribe(i => {
    env.nextState({
      index: env.index + 1,
      state: {
        message: 'Hello',
        name: 'World',
      },
    });
  });
