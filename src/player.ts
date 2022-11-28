import { Entity } from './entity.js';
import { Asset } from './asset.js';
import { particles, props, timings } from './main.js';
import { keys } from './keyboard.js';
import { Bullet } from './bullet.js';
import { outsideScreen } from './util.js';
import { explode } from './explode.js';

const AShip = new Asset('spaceship1.png').image;

// The player
export class Player extends Entity {
  x = props.width / 2;
  y = props.height / 2;
  speed = 4;
  size = 9;
  
  nextBullet = 0;
  nextParticle = 0;
  
  tick() {
    // Controls
    if (keys.KeyA) this.direction -= .07;
    if (keys.KeyD) this.direction += .07;
    
    // Movement
    super.tick();
    
    // Fire
    if (this.nextBullet <= 0)
    {
      this.nextBullet = 1000 / 3;
      const bullet = new Bullet(this.scene);
      bullet.x = this.x;
      bullet.y = this.y;
      bullet.direction = this.direction;
      bullet.isPlayerOwner = true;
      this.scene.addEntity(bullet);
    }
    else this.nextBullet -= timings.delta;
    
    // Trail
    if ((this.nextParticle -= timings.delta) <= 0)
    {
      particles.push({
        x: this.x,
        y: this.y,
        z: Math.random() + 2,
        r: 0,
        vr: Math.random() * 0.2 - 0.1,
        t: 800,
        ts: 800,
        color: '#fff'
      });
      
      this.nextParticle = 20;
    }
    
    // Screen death
    if (outsideScreen(this.x, this.y, 3, 3)) this.explode();
  }
  
  // Draw
  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(Math.PI / 2 + this.direction);
    ctx.drawImage(AShip, -9 / 2, -9 / 2, 9, 9);
    ctx.restore();
  }
  
  // Destroy and explode
  explode() {
    explode(AShip, this.x, this.y);
    super.destroy();
  }
}