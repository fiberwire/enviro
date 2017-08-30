import {
  IEnvironmentOptions,
  IStateUpdate,
  ReactiveProperty,
} from '../index';

import {
  Observable,
  Observer,
  Scheduler,
  Subject,
  Subscription,
} from 'rxjs/Rx';

/**
 * An Environment whose state you update directly.
 *
 * @export
 * @abstract
 * @class DirectEnvironment
 * @implements {IEnvironment<EState>}
 * @template EState
 */
export abstract class DirectEnvironment<EState> {
  /**
   * Counter which keeps track of the current iteration
   *
   *
   * @type {ReactiveProperty<number>}
   * @memberof DirectEnvironment
   */
  public get index(): number {
    return this.currentState.index;
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
      index: 0,
      state: this.defaultState,
    };
  }

  public get currentState(): IStateUpdate<EState> {
    return this.state.value;
  }

  public get states(): Observable<IStateUpdate<EState>> {
    return this.state.asObservable();
  }

  // add all subs to this, so they can be in one place and easily unsubbed
  public subs: Subscription = new Subscription();

  /**
   * a subject where new states are sent before being set as the environment's state
   *
   * @private
   * @type {Subject<IStateUpdate<EState>>}
   * @memberof DirectEnvironment
   */
  private incomingStates: Subject<IStateUpdate<EState>> = new Subject();

  /**
   * The state of the environment. Can be subscribed to, which allows you to react to updates
   *
   * @private
   * @type {ReactiveProperty<IStateUpdate<EState>>}
   * @memberof DirectEnvironment
   */
  private state: ReactiveProperty<IStateUpdate<EState>> = new ReactiveProperty();

  /**
   * Creates an instance of DirectEnvironment.
   * @param {IEnvironmentOptions} options - contains options for setting up an Environment
   * @memberof DirectEnvironment
   */
  constructor(public options: IEnvironmentOptions) {
    this.reset();

    this.subs.add(this.update(this.incomingStates));
  }

  /**
   * Adds the provided state to inputStates for
   *
   * @param {IStateUpdate<EState>} state - the state update
   * @memberof DirectEnvironment
   */
  public nextState(state: IStateUpdate<EState>): void {
    this.incomingStates.next(state);
  }

  /**
   * Subscribes to stateUpdates, setting the state of the Environment
   * each time it receives a new update, and increments iteration
   *
   * @param {Observable<IStateUpdate<EState>>} updates - stream of state updates
   * @returns {Subscription}
   * @memberof DirectEnvironment
   */
  public update(updates: Observable<IStateUpdate<EState>>): Subscription {
    return this.incomingStates
      .filter(u => u.index === this.index + 1)
      .observeOn(Scheduler.asap)
      .subscribe(s => {
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
