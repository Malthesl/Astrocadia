import { IngameScene } from './ingame.js';
import { Vec2 } from './vec2.js';
import { timings } from './main.js';

export class Entity {
  scene: IngameScene;
  x = 0;
  y = 0;
  speed = 1;
  direction = 0;
  size = 1;
  
  constructor(scene: IngameScene) {
    this.scene = scene;
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
    if (this.scene) this.scene.entities.splice(this.scene.entities.indexOf(this), 1);
  }
}