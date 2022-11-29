// Get canvas and context
import { Scene } from './scene.js';
import { SplashScene } from './splash.js';
import { Stars } from './stars.js';
import { Vec2 } from './vec2.js';
import './keyboard.js';
import { HomeScene } from './home.js';
import { pressed } from './keyboard.js';

// Load entities
import './enemies/basicEnemy.js';
import './enemies/homingEnemy.js';
import './enemies/strafeEnemy.js';
import './text.js';
import { IngameScene } from './ingame.js';

// Find and create ctx
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
  ms: 0
};

// Debug
export let debugMode = 0;
window.addEventListener('keydown', e => {
  // Debug mode is accessed by Shift+Tab
  if (e.shiftKey && e.code === 'Tab')
  {
    e.preventDefault();
    debugMode++;
    // This can be changed later for more debug mode views
    if (debugMode > 2) debugMode = 0;
  }
});

const eachTickDebug: [number, number, number][] = new Array(400).fill([0, 0, 0]);
const debugGraph = <HTMLCanvasElement>document.getElementById('g_debug_graph');
const debugGraphCTX = debugGraph.getContext('2d');

debugGraph.height = 400;
debugGraph.width = 400;

let debugGraphScaleY = 4;

debugGraphCTX.scale(1, debugGraphScaleY);

let TS = 0, TE = 0, DS = 0, DE = 0;

setInterval(() => {
  if (debugMode === 2)
  {
    document.getElementById('g_debug').innerHTML = `
    Performance @ 0.1s
    ${(1000 / timings.delta).toFixed(2)} fps
    F: ~${timings.delta.toFixed(0)} ms
    S: ~${DE - TS} ms ${((DE - TS) / timings.delta * 100).toFixed(0)} %
    T: ~${TE - TS} ms ${((TE - TS) / timings.delta * 100).toFixed(0)} %
    D: ~${DE - DS} ms ${((DE - DS) / timings.delta * 100).toFixed(0)} %
  `.trim();
  }
}, 100);

// Particles
export let particles: {x: number, y: number, z: number, r: number, t: number, ts: number, vx?: number, vy?: number, vz?: number, vr?: number, color: string}[] = [];

// Main tick loop
function tick(ms: number) {
  timings.delta = ms - timings.ms;
  timings.ms = ms;
  timings.tick = Math.min(timings.delta / 1000 * 20, 1);
  
  TS = Date.now();
  
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
  
  TE = Date.now();
  
  // Draw
  DS = Date.now();
  draw();
  DE = Date.now();
  
  // Debug
  if (debugMode)
  {
    if (debugMode === 1)
    {
      document.getElementById('g_debug').innerHTML = `
      Performance @ NOW
      ${(1000 / timings.delta).toFixed(2)} fps
      F: ~${timings.delta.toFixed(0)} ms
      S: ~${DE - TS} ms ${((DE - TS) / timings.delta * 100).toFixed(0)} %
      T: ~${TE - TS} ms ${((TE - TS) / timings.delta * 100).toFixed(0)} %
      D: ~${DE - DS} ms ${((DE - DS) / timings.delta * 100).toFixed(0)} %
      Scene [${scene}]
      ${(<any>scenes[scene])?.entities ? 'E: ' + (<any>scenes[scene])?.entities.length : '(no entities)'}
      (G)P: ${particles.length}
      ${scenes[scene] instanceof IngameScene ? 'L: ' + (<IngameScene>scenes[scene]).levelId + ' (' + (<IngameScene>scenes[scene]).state + ')\n' + Math.floor((<IngameScene>scenes[scene]).time) + 'ms' : '(not a level)'}
    `.trim();
    }
    /**
     * DEBUG MENU EXPLANATION
     * fps - Current FPS
     * F - Time since last frame (delta)
     * S - Total tick & draw time + % tick & draw time of delta
     * T - Total tick time + % tick time of F
     * D - Total draw time + % draw time of F
     *
     * Scene - Current scene
     * E: Amount of entities, if an entities array is included with the scene
     * P: Global, number of particles
     * L: The current level, when playing a level, with game state in parentheses, and game time on the next line
     *
     * The procentages need to be <100% to continue at the current framerate
     * The goal is to always be under <20%, and be around <10% most of the time
     */
    
    eachTickDebug.shift();
    eachTickDebug.push([timings.delta, TE - TS, DE - DS]);
    
    debugGraphCTX.clearRect(0, 0, debugGraph.width, debugGraph.height / debugGraphScaleY);
    for (let i = 0; i < eachTickDebug.length; i++)
    {
      let t = eachTickDebug[i];
      debugGraphCTX.fillStyle = 'orange';
      debugGraphCTX.fillRect(i, debugGraph.height / debugGraphScaleY - t[0], 1, t[0]);
      debugGraphCTX.fillStyle = 'red';
      debugGraphCTX.fillRect(i, debugGraph.height / debugGraphScaleY - t[1] - t[2], 1, t[1] + t[2]);
      debugGraphCTX.fillStyle = 'blue';
      debugGraphCTX.fillRect(i, debugGraph.height / debugGraphScaleY - t[1], 1, t[1]);
    }
    
    /**
     * DEBUG GRAPH EXPLANATION
     * Yellow: Time since last frame. The following colors should stack up to be under this at all times, to keep the current framerate.
     * Blue: Time to tick
     * Red: Time to draw
     *
     * By default; 4px=1ms
     */
  }
  
  document.getElementById('g_debug').style.display = debugMode ? 'block' : 'none';
  document.getElementById('g_debug_graph').style.display = debugMode ? 'block' : 'none';
  
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