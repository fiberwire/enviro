import { DirectEnvironment } from '../src/environments/direct-environment';
import { IStateUpdate } from "../src/index";

import * as _ from "lodash";

interface IPoint {
    x: number;
    y: number;
}

interface IState {
    points: IPoint[];
}

class DirectTest extends DirectEnvironment<IState>  {
    public get initialState(): IStateUpdate<IState> {
        return {
            iteration: 0,
            state: {
                points: []
            },
        };
    }
}

test("DirectEnvironment", (done) => {

    it("should accept new states", () => {
        const env = new DirectTest({
            interactionRate: 60
        });

        env.state
            .asObservable()
            .subscribe(s => {
                done();
                
                env.incomingStates.next({
                    iteration: 1,
                    state: {
                        points: _.concat(s.state.points, { x: 1, y: 1 })
                    }
                });

                if (s.iteration === 0) {
                    expect(s.state.points.length).toBeLessThanOrEqual(1);
                } else {
                    expect(s.state.points.length).toBeGreaterThan(100);
                }                
            });

            env.incomingStates.next({
                iteration: 1,
                state: {
                    points: _.concat(env.state.value.state.points, { x: 1, y: 1 })
                }
            });
    });
    
});