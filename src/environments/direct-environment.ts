import {
  IEnvironment,
  IEnvironmentOptions,
  IStateUpdate,
  ReactiveProperty,
} from '../index';

import { Observable, Observer, Subject, Subscription } from 'rxjs/Rx';

/**
 * An Environment whose state you update directly.
 * 
 * @export
 * @abstract
 * @class DirectEnvironment
 * @implements {IEnvironment<EState>}
 * @template EState
 */
export abstract class DirectEnvironment<EState>
  implements IEnvironment<EState> {


  /**
   * Counter which keeps track of the current iteration
   * 
   * 
   * @type {ReactiveProperty<number>}
   * @memberof DirectEnvironment
   */
  public iteration: ReactiveProperty<number>;


  /**
   * The state of the environment. Can be subscribed to, which allows you to react to updates
   * 
   * @type {ReactiveProperty<IStateUpdate<EState>>}
   * @memberof DirectEnvironment
   */
  public state: ReactiveProperty<IStateUpdate<EState>> = new ReactiveProperty();


  /**
   * This is where to send new state updates
   * 
   * @readonly
   * @type {Observer<IStateUpdate<EState>>}
   * @memberof DirectEnvironment
   */
  public get inputStates(): Observer<IStateUpdate<EState>> {
    return this.incomingStates;
  }


  /**
   * Observable of new state updates that have yet to be applied to the Environment's state.
   * 
   * @readonly
   * @type {Observable<IStateUpdate<EState>>}
   * @memberof DirectEnvironment
   */
  public get updates(): Observable<IStateUpdate<EState>> {
    return this.incomingStates;
  }


  /**
   * The beginning state of the Environment.
   * 
   * @readonly
   * @abstract
   * @type {EState}
   * @memberof DirectEnvironment
   */
  public abstract get defaultState(): EState;


  /**
   * The beginning state update for the Environment. Uses defaultState as the state and 0 as the iteration.
   * 
   * @readonly
   * @type {IStateUpdate<EState>}
   * @memberof DirectEnvironment
   */
  public get initialState(): IStateUpdate<EState> {
    return {
      iteration: 0,
      state: this.defaultState,
    };
  }

  // add all subs to this, so they can be in one place and easily unsubbed
  public subs: Subscription = new Subscription();


  /**
   * the backing subject for inputState and updates
   * 
   * @private
   * @type {Subject<IStateUpdate<EState>>}
   * @memberof DirectEnvironment
   */
  private incomingStates: Subject<IStateUpdate<EState>> = new Subject();


  /**
   * Creates an instance of DirectEnvironment.
   * @param {IEnvironmentOptions} options - contains options for setting up an Environment
   * @memberof DirectEnvironment
   */
  constructor(public options: IEnvironmentOptions) {
    this.reset();
    this.iteration = new ReactiveProperty(this.state.value.iteration);

    this.subs.add(this.update(this.updates));
  }


  /**
   * Adds the provided state to inputStates for 
   * 
   * @param {IStateUpdate<EState>} state - the state update
   * @memberof DirectEnvironment
   */
  public nextState(state: IStateUpdate<EState>): void {
    this.inputStates.next(state);
  }


  /**
   * Subscribes to stateUpdates, setting the state of the Environment each time it receives a new update
   * 
   * @param {Observable<IStateUpdate<EState>>} stateUpdates - stream of state updates
   * @returns {Subscription} 
   * @memberof DirectEnvironment
   */
  public update(stateUpdates: Observable<IStateUpdate<EState>>): Subscription {
    return stateUpdates.subscribe(s => {
      this.state.value = s;
    });
  }

  
  /**
   * resets the environment back to a fresh state
   * 
   * @memberof DirectEnvironment
   */
  public reset(): void {
    this.state.value = this.initialState;
  }
}
