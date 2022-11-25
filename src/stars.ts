import { props, timings } from './main.js';
import { Vec2 } from './vec2.js';

/**
 * Draws stars in the background
 */
export class Stars {
  stars: {x: number, y: number, size: number, speed: number}[] = [];
  
  draw(ctx: CanvasRenderingContext2D, movement: Vec2 | false = false) {
    while (this.stars.length < 200 * props.particleFactor)
    {
      this.stars.push({
        x: Math.random() * props.width,
        y: Math.random() * props.height,
        size: Math.random() * 0.3 + 0.3,
        speed: Math.random() * 0.2 + 0.1
      });
    }
    
    for (const star of this.stars)
    {
      if (movement)
      {
        star.x += movement.x * star.speed * timings.tick;
        star.y += movement.y * star.speed * timings.tick;
      }
      
      if (star.x < -star.size)
      {
        star.x = props.width;
        star.y = Math.random() * props.height;
      }
      else if (star.x > props.width)
      {
        star.x = -star.size;
        star.y = Math.random() * props.height;
      }
      if (star.y < -star.size)
      {
        star.y = props.height;
        star.x = Math.random() * props.width;
      }
      else if (star.y > props.height)
      {
        star.y = -star.size;
        star.x = Math.random() * props.width;
      }
      
      ctx.fillStyle = '#fff';
      ctx.fillRect(star.x, star.y, star.size, star.size);
    }
  }
}