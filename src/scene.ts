import { Vec2 } from './vec2.js';

export class Scene {
  stars: boolean | Vec2 = true;
  
  ontick() {
  }
  
  ondraw(ctx: CanvasRenderingContext2D) {
  }
  
  onshow() {
  }
}