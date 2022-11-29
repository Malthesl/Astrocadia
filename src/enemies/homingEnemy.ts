import { IngameScene } from '../ingame.js';
import { Asset } from '../asset.js';
import { enemies } from '../enemies.js';
import { entities } from '../entities.js';
import { BasicEnemy } from './basicEnemy.js';
import { Player } from '../player.js';

const AHomingEnemy = new Asset('enemyship_homing.png').image;

export class HomingEnemy extends BasicEnemy {
  size = 9;
  image = AHomingEnemy;
  score = 25;
  
  constructor(scene: IngameScene, options: any) {
    super(scene, options);
  }
  
  tick() {
    let player = this.game.player;
    
    if (player)
    {
      this.direction = Math.atan2(player.y - this.y, player.x - this.x);
    }
    
    super.tick();
  }
  
  draw(ctx: CanvasRenderingContext2D) {
    super.draw(ctx);
  }
}

enemies['homingEnemy'] = HomingEnemy;
entities['homingEnemy'] = HomingEnemy;