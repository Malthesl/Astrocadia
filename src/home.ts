/**
 * The home menu / level selector
 */

import { Scene } from './scene.js';
import { props, timings } from './main.js';
import { Vec2 } from './vec2.js';
import { keys, pressed } from './keyboard.js';
import { getCurrentPlayerLevel, getLevelInfo, levelList, levels, startLevel } from './levels.js';
import { Asset } from './asset.js';

let ALevel = new Asset('level.png').image;
let ACompleted = new Asset('level_completed.png').image;
let AUnlocked = new Asset('level_unlocked.png').image;
let AStar = new Asset('star.png').image;

export class HomeScene extends Scene {
  transitionTime = 0;
  transitionDirection = -1;
  transitionScale = 1;
  fadeInTime = 0;
  
  currentLevel = 0;
  
  ondraw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    // fade-in and scale-in effect
    let f = 1 - Math.max(this.fadeInTime / 1000 - 0.1, 0);
    ctx.globalAlpha = f;
    ctx.translate(props.width / 2, props.height / 2);
    ctx.scale(f, f);
    
    // Current level name
    ctx.fillStyle = '#fff';
    ctx.font = '6px \'Press Start 2P\', cursive';
    ctx.fillText(
      levels[levelList[this.currentLevel]].name,
      (-ctx.measureText(levels[levelList[this.currentLevel]].name).width) / 2, // Positioning gets messy
      30 + 20 * Math.cos(this.currentLevel) -
      20 * (Math.cos(this.currentLevel) - Math.cos(this.currentLevel + this.transitionDirection)) * Math.max((this.transitionTime - 300) / 300, 0)
    );
    
    // Level orbs
    ctx.translate(-110 * this.currentLevel, 40);
    
    // Draw the lines
    ctx.beginPath();
    let x = (i: number): number => 110 * i - 110 * Math.max((this.transitionTime - 300) / 300, 0) * this.transitionDirection;
    for (let i = 0; i < levelList.length; i++)
    {
      ctx.lineTo(x(i), 20 * Math.cos(i) + 13);
    }
    ctx.strokeStyle = '#444';
    ctx.lineWidth = 2;
    ctx.setLineDash([5]);
    ctx.stroke();
    
    // Draw the orbs
    for (let i = 0; i < levelList.length; i++)
    {
      let im;
      let {status, stars} = getLevelInfo(levelList[i]);
      
      // Select the image used for different level states
      switch (status)
      {
        case 'completed':
          im = ACompleted;
          break;
        case 'unlocked':
          im = AUnlocked;
          break;
        default:
          im = ALevel;
          break;
      }
      
      // Draw the orb
      ctx.drawImage(
        im,
        x(i) - 13,
        20 * Math.cos(i), 26, 26
      );
      
      // Draw the level number
      ctx.font = '10px \'Press Start 2P\', cursive';
      ctx.fillText((i + 1).toString(), x(i) - ctx.measureText((this.currentLevel + 1).toString()).width / 2, 20 * Math.cos(i) + 18);
      
      // Draw the stars
      if (stars === 1)
      {
        ctx.drawImage(AStar, x(i) - 7, 20 * Math.cos(i) + 20, 13, 13);
      }
      if (stars === 2)
      {
        ctx.drawImage(AStar, x(i) - 13, 20 * Math.cos(i) + 20, 13, 13);
        ctx.drawImage(AStar, x(i), 20 * Math.cos(i) + 20, 13, 13);
      }
      if (stars === 3)
      {
        ctx.drawImage(AStar, x(i) - 7 - 13, 20 * Math.cos(i) + 22, 13, 13);
        ctx.drawImage(AStar, x(i) - 7, 20 * Math.cos(i) + 20, 13, 13);
        ctx.drawImage(AStar, x(i) - 7 + 13, 20 * Math.cos(i) + 22, 13, 13);
      }
    }
    ctx.restore();
  }
  
  ontick() {
    // Handle fade-in time
    if (this.fadeInTime > 0) this.fadeInTime -= timings.delta;
    else this.fadeInTime = 0;
    
    // Handle star movement and transition time, also used when selecting levels
    if (this.transitionTime > 0)
    {
      this.stars = new Vec2(100 * this.transitionTime / 1000 * this.transitionScale * this.transitionDirection + this.transitionDirection, 10 * this.transitionTime / 1000 * this.transitionScale + 1);
      this.transitionTime -= timings.delta;
    }
    else
    {
      this.stars = new Vec2(this.transitionDirection, 1);
      this.transitionTime = 0;
    }
    
    // Select previous level
    if ((pressed.KeyA || keys.KeyA && this.transitionTime < 300) && this.currentLevel > 0)
    {
      this.currentLevel -= 1;
      this.transitionTime = 600;
      this.transitionDirection = 1;
      this.transitionScale = 1;
    }
    // Select next level
    else if ((pressed.KeyD || keys.KeyD && this.transitionTime < 300) && this.currentLevel < levelList.length - 1)
    {
      this.currentLevel += 1;
      this.transitionTime = 600;
      this.transitionDirection = -1;
      this.transitionScale = 1;
    }
    // Start level
    if (pressed.Enter) startLevel(levelList[this.currentLevel]);
  }
  
  initial = true;
  
  onshow() {
    // On first visit, the next level should be selected
    if (this.initial)
    {
      this.currentLevel = levelList.indexOf(getCurrentPlayerLevel());
      this.initial = false;
    }
    // Set transition
    this.transitionTime = 1000;
    this.transitionDirection = 0;
    this.transitionScale = 4;
    this.fadeInTime = 700;
  }
  
  stars = new Vec2(0, 0);
}