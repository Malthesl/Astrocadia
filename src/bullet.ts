import { Entity } from './entity.js';
import { Asset } from './asset.js';
import { Vec2 } from './vec2.js';
import { timings } from './main.js';
import { explode } from './explode.js';
import { outsideScreen } from './util.js';
import { BasicEnemy } from './basicEnemy.js';

const ABullet = new Asset('bullet1.png').image;

export class Bullet extends Entity {
  speed = 8;
  size = 3;
  isPlayerOwner = false;
  
  tick() {
    let d = Vec2.direction(this.direction).mul(this.speed * timings.tick);
    this.x += d.x;
    this.y += d.y;
    
    // Collision with wall
    if (outsideScreen(this.x, this.y, 3, 3)) {
      explode(ABullet, this.x, this.y);
      this.destroy();
    }
    
    // Detect with entity
    for (let i = 0; i < this.game.entities.length; i++)
    {
      let entity = this.game.entities[i];
      
      if (entity === this) continue;
      
      // If the player is the owner of the bullet, it should only hit enemies (which all should extend BasicEnemy
      if (this.isPlayerOwner && entity instanceof BasicEnemy)
      {
        if (Vec2.dist(entity, this) - entity.size / 2 - this.size / 2 < 0)
        {
          entity.explode();
          this.destroy();
        }
      }
    }
  }
  
  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(Math.PI / 2 + this.direction);
    ctx.drawImage(ABullet, -3 / 2, -3 / 2, 3, 3);
    ctx.restore();
  }
}