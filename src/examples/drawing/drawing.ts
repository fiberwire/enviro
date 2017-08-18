import * as phantom from 'phantom';
import { DirectEnvironment, IStateUpdate, ReactiveCollection } from '../../index';

interface IPixel {
  r: number;
  g: number;
  b: number;
  a: number;

  x: number;
  y: number;
}

interface IPixelGrid {
  pixels: ReactiveCollection<IPixel>;
}

class DrawingEnvironment extends DirectEnvironment<IPixelGrid> {
  public get initialState(): IStateUpdate<IPixelGrid> {
    return {
      iteration: 0,
      state: {
        pixels: new ReactiveCollection(),
      },
    };
  }
}

const env = new DrawingEnvironment({ interactionRate: 60 });

const canvas = document.getElementById("surface") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");

env.state
  .subscribe(update => {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, 500, 500);

    update.state.pixels.forEach(px => {
      ctx.fillStyle = `rgba(${px.r},${px.g},${px.b},${px.a})`
      ctx.fillRect(px.x, px.y, 1, 1);
    })
  });

canvas.addEventListener("mousedown", (event: MouseEvent) => {
  env.incomingStates.next({
    state: {
      pixels: env.state
    }
  })
})