import { Entity } from './entity.js';
import { IngameScene } from './ingame.js';
import { props } from './main.js';
import { Asset } from './asset.js';
import { explode } from './explode.js';
import { enemies } from './enemies.js';
import { Player } from './player.js';
import { Vec2 } from './vec2.js';
import { entities } from './entities.js';

const AEnemy = new Asset('enemyship_simple.png').image;

interface BasicEnemySpawnOptions {
  side?: 'left' | 'top' | 'right' | 'bottom';
  speed?: number;
}

export class BasicEnemy extends Entity {
  size = 15;
  
  constructor(scene: IngameScene, options: BasicEnemySpawnOptions) {
    super(scene);
    
    this.speed = options.speed || 2;
    
    switch (options.side)
    {
      case 'left':
        this.x = -10;
        this.y = Math.random() * props.height;
        this.direction = Math.random() - 0.5;
        break;
    }
    
  }
  
  tick() {
    super.tick();
    if (this.x > props.width + this.size) this.destroy();
    
    // Collision with player
    let player = <Player>this.game.entities.find(e => e instanceof Player);
  
    if (player && Vec2.dist(player, this) - player.size / 2 - this.size / 2 < 0)
    {
      player.explode();
      this.destroy();
    }
  }
  
  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(Math.PI / 2 + this.direction);
    ctx.drawImage(AEnemy, -15 / 2, -15 / 2, 15, 15);
    ctx.restore();
  }
  
  explode() {
    explode(AEnemy, this.x, this.y);
    this.game.score += 20;
    this.destroy();
  }
}

enemies['basicEnemy'] = BasicEnemy;
entities['basicEnemy'] = BasicEnemy;