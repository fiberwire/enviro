import { Observable, Scheduler, Subject, Subscription } from 'rxjs';

import * as _ from "lodash";
import { IAgentUpdate, IEnvironment, IEnvironmentOptions, IInteraction, IStateUpdate, ReactiveCollection, ReactiveProperty, IAgentEnvironment } from "../index";

export abstract class AgentEnvironment<AState, EState>
implements
IAgentEnvironment<AState, EState> {
  public state: ReactiveProperty<IStateUpdate<EState>>;

  public incomingStates: Subject<IStateUpdate<EState>>;

  public incomingInteractions: Subject<IAgentUpdate<AState>>;

  private subs: Subscription;

  constructor(public options: IEnvironmentOptions) {
    this.subs = new Subscription();
    this.incomingInteractions = new Subject<IAgentUpdate<AState>>();
    this.incomingStates = new Subject<IStateUpdate<EState>>();
    this.state = new ReactiveProperty<IStateUpdate<EState>>(this.initialState);

    this.subs.add(this.interaction());
  }

  // The beginning state of the Environment
  public abstract get initialState(): IStateUpdate<EState>;

  public get bufferedInteractions(): Observable<Array<IAgentUpdate<AState>>> {
    const rate = this.options.interactionRate; // default to 1000 if interaction rate isn't specified

    return this.incomingInteractions
      .filter(i => i.iteration > this.state.value.iteration) // only accept new interactions
      .bufferTime(1000 / rate) // buffer new interactions periodically
      .filter(interactions => interactions.length > 0); // do notihng if there are no interactions
  }

  public get randomInteractions(): Observable<IAgentUpdate<AState>> {
    return this.bufferedInteractions.map(interactions => {
      const i = _.shuffle(interactions)[0];
      return i;
    }); // choose a random interaction from buffer
  }

  public get assignedInteractions(): Observable<IAgentUpdate<AState>> {
    return this.bufferedInteractions.map(i => {
      return i.reduceRight((prev, curr) => {
        return { ...prev, ...curr };
      });
    });
  }

  // resets the environment back to a fresh state
  public reset(): void {
    this.state.value = this.initialState;
  }

  public abstract async applyInteraction(
    agentState: IInteraction<AState, EState>
  ): Promise<IStateUpdate<EState>>;

  private interaction(): Subscription {
    return this.interactions
      .observeOn(Scheduler.asap)
      .subscribeOn(Scheduler.asap)
      .subscribe(
      async i => {
        const oldState = this.state.value;
        const newState = await this.applyInteraction(i);
        const interaction = i;

        // set new state
        this.state.value = newState;

        // send interaction back to organism so it knows its interaction was applied
        i.interactions.next({
          interaction,
          newState,
          oldState,
        });
      },
      error => console.log(`error in environment.interaction: ${error}`),
      () => console.log(`environment completed interaction`)
      );
  }
}
