import { IAgentUpdate, IStateUpdate } from "../index";

export interface IInteraction<AState, EState> {
    oldState: IStateUpdate<EState>;
    newState: IStateUpdate<EState>;
    interaction: IAgentUpdate<AState>;
}
