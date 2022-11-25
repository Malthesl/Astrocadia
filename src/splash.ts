import { Scene } from './scene.js';
import { Asset } from './asset.js';
import { props, setScene, timings } from './main.js';
import { Vec2 } from './vec2.js';
import { keys } from './keyboard.js';

let splashImage = new Asset('logo2.png').image;

export class SplashScene extends Scene {
  ondraw(ctx: CanvasRenderingContext2D) {
    // Logo
    let width = 280 / 3;
    let height = 328 / 3;
    ctx.drawImage(splashImage, (props.width - width) / 2, (props.height - height) / 2, width, height);
    
    // Version text
    ctx.fillStyle = '#fff';
    ctx.font = '4px \'Press Start 2P\', cursive';
    ctx.fillText('v2.0b1', (props.width + width) / 2, (props.height - height) / 2 + 4);
    
    // Blinking "press to start" text
    ctx.fillStyle = timings.ms % 2000 < 1000 ? '#fff' : '#0000';
    ctx.font = '10px \'Press Start 2P\', cursive';
    ctx.fillText('Press any key to start', (props.width - ctx.measureText('Press any key to start').width) / 2, props.height - 50);
    ctx.font = '6px \'Press Start 2P\', cursive';
    ctx.fillText('This game is keyboard only', (props.width - ctx.measureText('This game is keyboard only').width) / 2, props.height - 32);
  }
  
  ontick() {
    if (keys.any) setScene('home');
  }
  
  stars = new Vec2(-1, 1);
}