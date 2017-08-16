import { Subject } from "rxjs/Subject";
import { IAgentUpdate, IEnvironment } from "../index";

export interface IAgentEnvironment<AState, EState> extends IEnvironment<EState> {
  incomingInteractions: Subject<IAgentUpdate<AState>>;
}
