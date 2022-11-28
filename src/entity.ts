import { IngameScene } from './ingame.js';
import { Vec2 } from './vec2.js';
import { timings } from './main.js';

export class Entity {
  game: IngameScene;
  x = 0;
  y = 0;
  speed = 0;
  direction = 0;
  size = 1;
  
  constructor(scene: IngameScene, options?: any) {
    this.game = scene;
  }
  
  tick() {
    // Movement
    let dir = Vec2.direction(this.direction).mul(this.speed * timings.tick);
    this.x += dir.x;
    this.y += dir.y;
  }
  
  draw(ctx: CanvasRenderingContext2D) {
  }
  
  destroy() {
    if (this.game) this.game.entities.splice(this.game.entities.indexOf(this), 1);
  }
}