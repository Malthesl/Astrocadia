// Get canvas and context
import { Scene } from './scene.js';
import { SplashScene } from './splash.js';
import { Stars } from './stars.js';
import { Vec2 } from './vec2.js';
import './keyboard.js';
import { HomeScene } from './home.js';
import { pressed } from './keyboard.js';

const canvas = <HTMLCanvasElement>document.getElementById('main-canvas');
const ctx = canvas.getContext('2d');

// Canvas size and scale properties
export let props = {
  // dynamic
  actualWidth: 0,
  actualHeight: 0,
  scale: 1,
  ratio: 1,
  // static
  width: 340,
  height: 255,
  // settings
  particleFactor: 1, // how many particles should there be created? 1 = 100%
};

// Scene
export let scene = 'splash-screen';

export function setScene(name: string) {
  if (scenes[name])
  {
    scene = name;
    scenes[scene].onshow();
  }
  else
  {
    console.warn(`Scene "${name}" does not exist!`);
  }
}

export let scenes: {[key: string]: Scene} = {};

// Assign scenes
scenes['splash-screen'] = new SplashScene();
scenes['home'] = new HomeScene();
scenes['ingame'] = null;

// Reset canvas, initially and on screen resize
function resetCanvas() {
  // Calculate ratio
  props.ratio = props.width / props.height;
  
  // Fit canvas to viewport
  if (window.innerWidth / props.ratio < window.innerHeight)
  {
    props.actualWidth = window.innerWidth;
    props.actualHeight = window.innerWidth / props.ratio;
  }
  else
  {
    props.actualWidth = window.innerHeight * props.ratio;
    props.actualHeight = window.innerHeight;
  }
  
  // Calculate scaling
  props.scale = window.devicePixelRatio * (props.actualWidth / props.width);
  
  // Set canvas size
  canvas.width = props.width * props.scale;
  canvas.height = props.height * props.scale;
  // Scale canvas to fit props.width and props.height
  ctx.scale(props.scale, props.scale);
  // Position canvas
  canvas.style.width = props.actualWidth + 'px';
  canvas.style.height = props.actualHeight + 'px';
  canvas.style.left = Math.floor((window.innerWidth - props.actualWidth) / 2) + 'px';
  canvas.style.top = Math.floor((window.innerHeight - props.actualHeight) / 2) + 'px';
  
  canvas.style.imageRendering = 'pixelated';
  ctx.imageSmoothingEnabled = false;
}

// Timings for each tick
export let timings = {
  delta: 0,
  tick: 0,
  ms: 0,
};

export let particles: {x: number, y: number, z: number, r: number, t: number, ts: number, vx?: number, vy?: number, vz?: number, vr?: number, color: string}[] = [];

// Main tick loop
function tick(ms: number) {
  timings.delta = ms - timings.ms;
  timings.ms = ms;
  timings.tick = Math.min(timings.delta / 1000 * 20, 1);
  
  // Particles movement
  for (let i = particles.length - 1; i >= 0; i--)
  {
    let p = particles[i];
    p.x += (p.vx || 0) * timings.tick;
    p.y += (p.vy || 0) * timings.tick;
    p.z += (p.vz || 0) * timings.tick;
    p.r += (p.vr || 0) * timings.tick;
    p.t -= timings.delta;
    if (p.t <= 0) particles.splice(i, 1);
  }
  
  // Scene
  scenes[scene].ontick();
  
  // Draw
  draw();
  
  // FPS-counter
  ctx.font = '4px Arial';
  let DBT = (1000 / timings.delta).toFixed(2) + ' fps';
  let DBW = ctx.measureText(DBT).width;
  ctx.fillStyle = '#444';
  ctx.fillRect(0, 0, DBW + 2, 6);
  ctx.fillStyle = '#fff';
  ctx.fillText(DBT, 1, 4.4);
  
  for (const key in pressed)
  {
    pressed[key] = false;
  }
  
  requestAnimationFrame(tick);
}

let stars = new Stars();

// Draw each frame
function draw() {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, props.width, props.height);
  
  // Stars
  if (scenes[scene].stars) stars.draw(ctx, scenes[scene].stars instanceof Vec2 ? <Vec2>scenes[scene].stars : false);
  
  // Particles
  for (let i = 0; i < particles.length; i++)
  {
    let p = particles[i];
    ctx.translate(p.x, p.y);
    ctx.rotate(p.r);
    ctx.globalAlpha = Math.min(1, Math.max(p.t / p.ts, 0));
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.z / 2, -p.z / 2, p.z, p.z);
    ctx.rotate(-p.r);
    ctx.translate(-p.x, -p.y);
  }
  ctx.globalAlpha = 1;
  
  // Scene
  scenes[scene].ondraw(ctx);
}

// Initiate
resetCanvas();
requestAnimationFrame(tick);

// Event listeners
window.addEventListener('resize', resetCanvas);