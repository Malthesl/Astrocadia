import { props } from './main.js';

// Does the rect (x,y,w,h) touch the edge of the screen, or is it outside the scene.
export function outsideScreen(x: number, y: number, w: number, h: number): boolean {
  return (x < 0 || y < 0 || x + w > props.width || y + h > props.height);
}

// Get a duration in ms as a string: 12345 -> "0:12.345"
export function getTimeText(timeInMs: number): string {
  let ms = Math.floor(timeInMs) % 1000;
  let s = Math.floor(timeInMs / 1000) % 60;
  let m = Math.floor(timeInMs / 1000 / 60) % 60;
  let h = Math.floor(timeInMs / 1000 / 60 / 60);
  if (h === 0)
  {
    return m.toString() + ':' + s.toString().padStart(2, '0') + '.' + ms.toString().padStart(3, '0');
  }
  else
  {
    return m.toString().padStart(2, '0') + ':' + s.toString().padStart(2, '0') + '.' + ms.toString().padStart(3, '0');
  }
}