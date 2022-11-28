import { particles, props } from './main.js';
import { Vec2 } from './vec2.js';

const mc = document.createElement('canvas');
const ctx = mc.getContext('2d', {willReadFrequently: true});

/**
 * Creates the explosion effect out of an image
 */
export function explode(image: HTMLImageElement, x: number, y: number) {
  // Get colors
  let samples: string[] = [];
  while (samples.length < Math.min(image.width, 10))
  {
    mc.width = 1;
    mc.height = 1;
    // Extract color
    ctx.drawImage(image, Math.floor(Math.random() * image.width), Math.floor(Math.random() * image.height), 1, 1, 0, 0, 1, 1);
    let color = ctx.getImageData(0, 0, 1, 1).data;
    // Apply to list
    if (color[3] === 0) continue;
    let hColor = color[0].toString(16).padStart(2, '0') + color[1].toString(16).padStart(2, '0') + color[2].toString(16).padStart(2, '0');
    samples.push(hColor);
  }
  
  for (let i = 0; i < image.width ** 1.6 * props.particleFactor; i++)
  {
    let dir = Vec2.direction(Math.random() * Math.PI * 2);
    particles.push({
      x,
      y,
      vx: dir.x * (Math.random() * 2 + 0.5),
      vy: dir.y * (Math.random() * 2 + 0.5),
      z: 1,
      r: 0,
      t: 1000,
      ts: 1000,
      color: '#' + samples[Math.floor(Math.random() * samples.length)]
    });
  }
}