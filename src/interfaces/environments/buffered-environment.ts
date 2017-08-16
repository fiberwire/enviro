import { Observable, Subscription } from 'rxjs/Rx';

import { IEnvironment, IStateUpdate } from '../../index';

export interface IBufferedEnvironment<EState> extends IEnvironment<EState> {
  bufferUpdates(
    updates: Observable<IStateUpdate<EState>>
  ): Observable<Array<IStateUpdate<EState>>>;
  applyUpdates(buffers: Observable<Array<IStateUpdate<EState>>>): Subscription;
}
