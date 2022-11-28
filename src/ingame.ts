import { Scene } from './scene.js';
import { levels } from './levels.js';
import { Player } from './player.js';
import { Entity } from './entity.js';
import { BasicEnemy } from './basicEnemy.js';
import { timings } from './main.js';
import { enemies } from './enemies.js';

interface Level {
  name: string,
  goal: {
    type: "destroy",
    targets: ["basicEnemy"],
    stars: [20, 50, 100]
  },
  player: {
    offsetX: 0,
    offsetY: 0,
    direction: 0
  },
  environment: {
    panX: 0,
    panY: 0,
    stars: true
  },
  spawners: [
    {
      id: "basicEnemy",
      start: 500, // after X ms
      startRate: 1000, // each X ms
      endRate: 200, // each X ms
      rangePct: 0.5, // +-% random change in rates
      transitionTime: 60000 // after X ms,
      args: {
        // any, e.g.:
        side: "left",
        speed: 2
      }
    }
  ]
}

// This scene is used when the player is playing a level
export class IngameScene extends Scene {
  entities: Entity[] = [];
  level: Level;
  
  state = 'loading';
  start = 0;
  time = 0;
  
  spawners: {next: number, transition: number, started: boolean}[] = [];
  
  constructor(id: string) {
    super();
    
    fetch('levels/' + levels[id].id + '.json')
      .then(res => res.json())
      .then(level => {
        this.state = 'ready';
        this.level = level;
      });
    
    // Spawn player
    this.entities.push(new Player(this));
  }
  
  ontick() {
    if (this.state !== 'ready') return;
    
    let now = Date.now();
    if (!this.start) this.start = now;
    this.time = now - this.start;
    
    // Tick through all the entities
    for (const entity of this.entities)
    {
      entity.tick();
    }
    // Check for goal conditions
    // Spawn enemies
    for (let i = 0; i < this.level.spawners.length; i++)
    {
      let spawner = this.level.spawners[i];
      
      if (!this.spawners[i]) this.spawners[i] = {
        next: spawner.start,
        transition: spawner.transitionTime,
        started: false,
      };
      
      if (this.spawners[i].started && this.spawners[i].transition > 0)
      {
        this.spawners[i].transition = Math.max(this.spawners[i].transition - timings.delta, 0);
      }
  
      if ((this.spawners[i].next -= timings.delta) <= 0)
      {
        this.spawners[i].started = true;
        this.addEntity(new enemies[spawner.id](this, spawner.args));
        
        let r = 1 + (Math.random() * 2 - 1) * spawner.rangePct;
  
        this.spawners[i].next = (spawner.endRate + (spawner.startRate - spawner.endRate) * this.spawners[i].transition / spawner.transitionTime) * r;
      }
    }
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