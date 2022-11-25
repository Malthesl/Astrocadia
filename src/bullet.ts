import { Entity } from './entity.js';
import { Asset } from './asset.js';
import { Vec2 } from './vec2.js';
import { timings } from './main.js';
import { explode } from './explode.js';
import { outsideScreen } from './util.js';

const ABullet = new Asset('bullet1.png').image;

export class Bullet extends Entity {
  x = 0;
  y = 0;
  direction = 0;
  speed = 8;
  
  tick() {
    let d = Vec2.direction(this.direction).mul(this.speed * timings.tick);
    this.x += d.x;
    this.y += d.y;
    
    if (outsideScreen(this.x, this.y, 3, 3)) {
      explode(ABullet, this.x, this.y);
      this.destroy();
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