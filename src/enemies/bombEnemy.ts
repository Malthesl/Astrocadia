import { IngameScene } from '../ingame.js';
import { Asset } from '../asset.js';
import { enemies } from '../enemies.js';
import { entities } from '../entities.js';
import { BasicEnemy } from './basicEnemy.js';
import { Vec2 } from '../vec2.js';
import { timings } from '../main.js';
import { Player } from '../player.js';

const AEnemy = new Asset('enemyship_simple.png').image;
const ABomb = new Asset('bomb.png').image;

export class BombEnemy extends BasicEnemy {
  size = 15;
  image = AEnemy;
  score = 25;
  
  bomb: EnemyBomb = null;
  
  constructor(scene: IngameScene, options: any) {
    super(scene, options);
    
    this.bomb = new EnemyBomb(scene, {});
    
    scene.addEntity(this.bomb);
  }
  
  tick() {
    let dir = Vec2.direction(this.direction).mul(30);
    
    if (!this.bomb.dropped)
    {
      this.bomb.x = this.x - dir.x;
      this.bomb.y = this.y - dir.y;
  
      this.bomb.direction = this.direction;
      this.bomb.speed = this.speed;
    }
    
    super.tick();
  }
  
  destroy() {
    super.destroy();
    
    this.bomb.dropped = true;
  }
}

export class EnemyBomb extends BasicEnemy {
  speed = 0;
  image = ABomb;
  collision = false;
  dropped = false;
  timer = 4000 + 1000 * Math.random();
  dropAt = 2500;
  explosionRadius = 28;
  
  tick() {
    this.timer -= timings.delta;
    
    if (this.timer < this.dropAt) this.dropped = true;
    
    if (this.dropped)
    {
      this.speed = Math.max(0, this.speed - 0.02 * timings.tick);
      super.tick();
      
      if (this.timer < 0) this.explode();
    }
  }
  
  draw(ctx: CanvasRenderingContext2D) {
    super.draw(ctx);
    
    // Explosion Zone
    if (this.dropped)
    {
      ctx.strokeStyle = '#f00';
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.explosionRadius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.explosionRadius * Math.min(this.timer / this.dropAt, 1), 0, Math.PI * 2);
      ctx.stroke();
    }
  }
  
  explode() {
    super.explode();
    
    for (let i = 0; i < this.game.entities.length; i++)
    {
      let entity = this.game.entities[i];
      if (entity !== this && (entity instanceof Player || entity instanceof BasicEnemy) && Vec2.dist(entity, this) - entity.size / 2 - this.explosionRadius < 0)
      {
        entity.explode();
      }
    }
  }
}

enemies['bombEnemy'] = BombEnemy;
entities['bombEnemy'] = BombEnemy;

enemies['enemyBomb'] = EnemyBomb;
entities['enemyBomb'] = EnemyBomb;