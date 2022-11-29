import { IngameScene } from '../ingame.js';
import { Asset } from '../asset.js';
import { enemies } from '../enemies.js';
import { entities } from '../entities.js';
import { BasicEnemy } from './basicEnemy.js';
import { Player } from '../player.js';
import { Vec2 } from '../vec2.js';
import { timings } from '../main.js';
import { Bullet } from '../bullet.js';

const AStrafeEnemy = new Asset('enemyship_strafe.png').image;

export class StrafeEnemy extends BasicEnemy {
  size = 15;
  image = AStrafeEnemy;
  score = 40;
  speed = 3;
  
  state = 'attacking';
  returnDirection = 0;
  nextBullet = 1000;
  
  constructor(scene: IngameScene, options: any) {
    super(scene, options);
  }
  
  tick() {
    let player = this.game.player;
    
    // Return when the player gets too close
    if (player && Vec2.dist(this, player) < 60 && this.state === 'attacking')
    {
      this.state = 'returning';
      this.returnDirection = this.direction + Math.PI;
    }
    
    // Return state
    if (this.state === 'returning')
    {
      this.direction = Math.min(this.returnDirection, this.direction + .005 * timings.delta);
    }
    // Pursuit/Attack state
    else if (player && this.state === 'attacking')
    {
      this.direction = Math.atan2(player.y - this.y, player.x - this.x);
      
      // Shoot
      
      // Fire
      if (this.nextBullet <= 0)
      {
        this.nextBullet = 1000 / 2;
        const bullet = new Bullet(this.game);
        bullet.x = this.x;
        bullet.y = this.y;
        bullet.direction = this.direction;
        this.game.addEntity(bullet);
      }
      else
      {
        this.nextBullet -= timings.delta;
      }
      
    }
    
    super.tick();
  }
  
  draw(ctx: CanvasRenderingContext2D) {
    super.draw(ctx);
  }
}

enemies['strafeEnemy'] = StrafeEnemy;
entities['strafeEnemy'] = StrafeEnemy;