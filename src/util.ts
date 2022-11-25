import { props } from './main.js';

// Does the rect (x,y,w,h) touch the edge of the screen, or is it outside the scene.
export function outsideScreen(x: number, y: number, w: number, h: number): boolean {
  return (x < 0 || y < 0 || x + w > props.width || y + h > props.height);
}