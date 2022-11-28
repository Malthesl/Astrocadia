import { Entity } from './entity.js';
import { IngameScene } from './ingame.js';
import { props } from './main.js';
import { entities } from './entities.js';

class Text extends Entity {
  content: string = '';
  color: string = '#fff';
  size: number = 10;
  
  constructor(scene: IngameScene, options: {content: string, x: number, y: number, color?: string, size?: number}) {
    super(scene, options);
    
    this.content = options.content;
    this.x = options.x;
    this.y = options.y;
    this.color = options?.color || '#fff';
    this.size = options?.size || 10;
  }
  
  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color;
    ctx.font = this.size + 'px \'Press Start 2P\', cursive';
    ctx.fillText(this.content, (props.width - ctx.measureText(this.content).width) / 2 + this.x, props.height / 2 + this.y);
  }
  
}

entities.text = Text;