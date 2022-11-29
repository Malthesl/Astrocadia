import { Entity } from '../entity.js';
import { IngameScene } from '../ingame.js';
import { props } from '../main.js';
import { Asset } from '../asset.js';
import { explode } from '../explode.js';
import { enemies } from '../enemies.js';
import { Player } from '../player.js';
import { Vec2 } from '../vec2.js';
import { entities } from '../entities.js';

const AEnemy = new Asset('enemyship_simple.png').image;

interface BasicEnemySpawnOptions {
  sides?: ('left' | 'top' | 'right' | 'bottom')[];
  speed?: number;
}

export class BasicEnemy extends Entity {
  size = 15;
  image = AEnemy;
  score = 20;
  
  constructor(scene: IngameScene, options: BasicEnemySpawnOptions) {
    super(scene);
    
    this.speed = options.speed || 2;
    
    let side = options.sides[Math.floor(Math.random() * options.sides.length)]
    
    switch (side)
    {
      case 'left':
        this.x = -10;
        this.y = Math.random() * props.height;
        this.direction = Math.random() - 0.5;
        break;
      case 'top':
        this.x = Math.random() * props.width;
        this.y = -10;
        this.direction = Math.random() - 0.5 + Math.PI / 2;
        break;
      case 'right':
        this.x = props.width + 10;
        this.y = Math.random() * props.height;
      this.direction = Math.random() - 0.5 + Math.PI;
        break;
      case 'bottom':
        this.x = Math.random() * props.width;
        this.y = props.height + 10;
        this.direction = Math.random() - 0.5 + Math.PI / 2 * 3;
        break;
    }
    
  }
  
  tick() {
    super.tick();
    
    // Remove entity once it leaves the scene
    let v = Vec2.direction(this.direction);
    if (v.x > 0 && this.x > props.width + this.size) this.destroy();
    if (v.x < 0 && this.x < 0 - this.size) this.destroy();
    if (v.y > 0 && this.y > props.height + this.size) this.destroy();
    if (v.y < 0 && this.y < 0 - this.size) this.destroy();
    
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
    ctx.drawImage(this.image, -this.image.width / 2, -this.image.width / 2, this.image.width, this.image.width);
    ctx.restore();
  }
  
  explode() {
    explode(this.image, this.x, this.y);
    this.game.score += this.score;
    this.destroy();
  }
}

enemies['basicEnemy'] = BasicEnemy;
entities['basicEnemy'] = BasicEnemy;