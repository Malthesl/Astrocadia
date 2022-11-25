import { IngameScene } from './ingame.js';

export class Entity {
  scene: IngameScene;
  
  constructor(scene: IngameScene) {
    this.scene = scene;
  }
  
  tick() {
  }
  
  draw(ctx: CanvasRenderingContext2D) {
  }
  
  destroy() {
    if (this.scene) this.scene.entities.splice(this.scene.entities.indexOf(this), 1);
  }
}