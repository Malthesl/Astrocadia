import { Scene } from './scene.js';
import { Level, levels } from './levels.js';
import { Player } from './player.js';
import { Entity } from './entity.js';

// This scene is used when the player is playing a level
export class IngameScene extends Scene {
  entities: Entity[] = [];
  level: Level;

  constructor(id: string) {
    super();
    
    this.level = levels[id];
    
    // Spawn player
    this.entities.push(new Player(this));
  }
  
  ontick() {
    // Tick through all the entities
    for (const entity of this.entities)
    {
      entity.tick();
    }
    // Check for goal conditions etc.
    // Spawn enemies
  }
  
  ondraw(ctx: CanvasRenderingContext2D) {
    // Draw all the entities
    for (const entity of this.entities)
    {
      entity.draw(ctx);
    }
    // Draw goal progress text etc. (UI)
  }
  
  // Add a new entity to the scene
  addEntity(entity: Entity) {
    this.entities.push(entity);
  }
  
}