import { Scene } from './scene.js';
import { levels } from './levels.js';
import { Player } from './player.js';
import { Entity } from './entity.js';
import { props, setScene, timings } from './main.js';
import { enemies } from './enemies.js';
import { Asset } from './asset.js';
import { Vec2 } from './vec2.js';
import { pressed } from './keyboard.js';
import { user } from './user.js';
import { getTimeText } from './util.js';
import { entities } from './entities.js';

interface Level {
  name: string,
  goal: {
    type: 'score' | 'destroy' | 'time',
    stars: [20, 50, 100]
  },
  player: {
    offsetX: 0,
    offsetY: 0,
    direction: 0
  },
  environment: {
    panX: 0,
    panY: 0,
    stars: true
  },
  spawners: {
    id: string,
    start: number, // after X ms
    startRate: number, // each X ms
    endRate: number, // each X ms
    rangePct: number, // +-% random change in rates
    transitionTime: number // after X ms,
    args: {[key: string]: any}
  }[],
  entities: {
    id: string,
    args: {[key: string]: any}
  }[]
}

const AStar = new Asset('star.png').image;
const AStarGray = new Asset('star_gray.png').image;

// This scene is used when the player is playing a level
export class IngameScene extends Scene {
  entities: Entity[] = [];
  level: Level;
  levelId: string;
  
  state = 'loading';
  time = 0;
  score = 0;
  
  finalTime = 0;
  finalScore = 0;
  
  spawners: {next: number, transition: number, started: boolean}[] = [];
  
  constructor(id: string) {
    super();
    
    this.levelId = levels[id].id;
    
    fetch('levels/' + levels[id].id + '.json')
      .then(res => res.json())
      .then(level => {
        this.state = 'playing';
        this.level = level;
        
        // Spawn initial entities
        this.level.entities.forEach(entity => {
          this.entities.push(new entities[entity.id](this, entity.args));
        });
        
      });
    
    // Spawn player
    this.entities.push(new Player(this));
  }
  
  ontick() {
    // Wait on the level to load before ticking
    if (this.state === 'loading' || this.state === 'paused') return;
    
    // Tick through all the entities
    for (const entity of this.entities)
    {
      entity.tick();
    }
    
    if (this.state === 'playing')
    {
      
      // While playing add time and score
      this.score += Math.min(timings.delta / 1000 * 2, 1);
      this.time += timings.delta;
      
      // Check for goal conditions
      
      // Go through each spawner, and spawn enemies
      for (let i = 0; i < this.level.spawners.length; i++)
      {
        let spawner = this.level.spawners[i];
        
        if (!this.spawners[i]) this.spawners[i] = {
          next: spawner.start,
          transition: spawner.transitionTime,
          started: false,
        };
        
        // Update the transition progress, used to change the rate from rateStart to rateEnd over time
        if (this.spawners[i].started && this.spawners[i].transition > 0)
        {
          this.spawners[i].transition = Math.max(this.spawners[i].transition - timings.delta, 0);
        }
        
        if ((this.spawners[i].next -= timings.delta) <= 0)
        {
          // started is set to true once the first enemy from the spawner spawns
          this.spawners[i].started = true;
          // Spawn enemy
          this.addEntity(new enemies[spawner.id](this, spawner.args));
          // Calculate the random range
          let r = 1 + (Math.random() * 2 - 1) * spawner.rangePct;
          // Calculate time until next spawn
          this.spawners[i].next = (spawner.endRate + (spawner.startRate - spawner.endRate) * this.spawners[i].transition / spawner.transitionTime) * r;
        }
      }
    }
    
    if (this.state === 'gameover')
    {
      this.gameoverTimer += timings.delta;
      
      if (this.gameoverTimer > 500 && pressed.any)
      {
        setScene('home');
      }
    }
    
  }
  
  gameoverTimer = 0;
  
  ondraw(ctx: CanvasRenderingContext2D) {
    // MOVE AWAY FROM ENTITIES AT GAMEOVER
    if (this.gameoverTimer)
    {
      ctx.translate(0, this.gameoverTimer / 10);
      
      this.stars = new Vec2(0, 12);
    }
    // Draw all the entities
    for (const entity of this.entities)
    {
      entity.draw(ctx);
    }
    // RESTORE TRANSFORM
    ctx.translate(0, -this.gameoverTimer / 10);
    
    // Draw ingame UI
    if (this.state === 'playing')
    {
      // Objective
      let objectiveText = 'Error: Unknown objective'; // should never be seen
      
      switch (this.level.goal.type)
      {
        case 'score':
          objectiveText = 'Get ' + Math.floor(this.score) + '/' + this.nextStar();
          break;
      }
      
      // Draw objective
      ctx.fillStyle = timings.ms % 1000 < 500 && this.nextStar() === 0 ? '#0000' : '#fff';
      ctx.font = '6px \'Press Start 2P\', cursive';
      let text = this.nextStar() === 0 ? (timings.ms % 2000 < 1000 ? 'LEVEL COMPLETED' : 'CRASH TO CONTINUE') : objectiveText;
      ctx.fillText(text, (props.width - ctx.measureText(text).width) / 2, 24);
      
      // Timer
      ctx.fillStyle = '#888';
      ctx.font = '6px \'Press Start 2P\', cursive';
      let timeText = getTimeText(this.time);
      ctx.fillText(timeText, props.width - ctx.measureText(timeText).width - 24, 24);
      
      // Achieved stars this game
      let stars = this.getStars(this.score);
      if (stars >= 1) ctx.drawImage(AStar, props.width / 2 - 13 * 2, 32);
      if (stars >= 2) ctx.drawImage(AStar, props.width / 2 - 13 / 2, 32);
      if (stars >= 3) ctx.drawImage(AStar, props.width / 2 + 13, 32);
    }
    
    // Draw postgame UI
    if (this.state === 'gameover')
    {
      // "GAMEOVER"
      ctx.fillStyle = timings.ms % 500 < 250 ? '#fff' : '#f00';
      ctx.font = '10px \'Press Start 2P\', cursive';
      ctx.fillText('GAMEOVER', (props.width - ctx.measureText('GAMEOVER').width) / 2, 80);
      
      // Final time
      ctx.fillStyle = this.gameoverTimer > 200 ? '#fff' : '#0000';
      ctx.font = '6px \'Press Start 2P\', cursive';
      let timeText = 'TIME ' + getTimeText(this.finalTime);
      ctx.fillText(timeText, (props.width - ctx.measureText(timeText).width) / 2, 95);
      
      // Final score
      ctx.fillStyle = this.gameoverTimer > 400 ? '#fff' : '#0000';
      ctx.font = '6px \'Press Start 2P\', cursive';
      let scoreText = 'SCORE ' + this.finalScore;
      ctx.fillText(scoreText, (props.width - ctx.measureText(scoreText).width) / 2, 105);
      
      // High score
      ctx.fillStyle = this.gameoverTimer > 600 ? '#fff' : '#0000';
      ctx.font = '6px \'Press Start 2P\', cursive';
      let highScoreText = 'HIGHSCORE ' + user.levels[this.levelId].highscore;
      ctx.fillText(highScoreText, (props.width - ctx.measureText(highScoreText).width) / 2, 115);
      
      // Final stars
      if (this.gameoverTimer < 800) return;
      let stars = this.getStars(this.finalScore);
      let anim = (this.gameoverTimer - 800) / 10;
      ctx.drawImage(stars >= 1 ? AStar : AStarGray, props.width / 2 - 13 * 2 - (stars >= 1 ? Math.max(0, 20 - anim) : 0), 125 - (stars >= 1 ? Math.max(0, 20 - anim) : 0), 13 + (stars >= 1 ? Math.max(0, 20 - anim) * 2 : 0), 13 + (stars >= 1 ? Math.max(0, 20 - anim) * 2 : 0));
      if (anim > 5)
        ctx.drawImage(stars >= 2 ? AStar : AStarGray, props.width / 2 - 13 / 2 - (stars >= 2 ? Math.max(0, 25 - anim) : 0), 125 - (stars >= 2 ? Math.max(0, 25 - anim) : 0), 13 + (stars >= 2 ? Math.max(0, 25 - anim) * 2 : 0), 13 + (stars >= 2 ? Math.max(0, 25 - anim) * 2 : 0));
      if (anim > 10)
        ctx.drawImage(stars >= 3 ? AStar : AStarGray, props.width / 2 + 13 - (stars >= 3 ? Math.max(0, 30 - anim) : 0), 125 - (stars >= 3 ? Math.max(0, 30 - anim) : 0), 13 + (stars >= 3 ? Math.max(0, 30 - anim) * 2 : 0), 13 + (stars >= 3 ? Math.max(0, 30 - anim) * 2 : 0));
      
      // "PRESS ANY KEY TO CONTINUE"
      ctx.fillStyle = this.gameoverTimer > 2000 && this.gameoverTimer % 2000 < 1000 ? '#fff' : '#0000';
      ctx.font = '6px \'Press Start 2P\', cursive';
      let continueText = 'PRESS ANY KEY TO CONTINUE';
      ctx.fillText(continueText, (props.width - ctx.measureText(continueText).width) / 2, 155);
    }
  }
  
  // Find the amount of time or score etc. needed for the next goal
  nextStar(): number {
    switch (this.level.goal.type)
    {
      case 'score':
        for (let i = 0; i < this.level.goal.stars.length; i++)
        {
          if (this.score < this.level.goal.stars[i]) return this.level.goal.stars[i];
        }
        break;
    }
    return 0;
  }
  
  getStars(score: number): number {
    switch (this.level.goal.type)
    {
      case 'score':
        for (let i = 0; i < this.level.goal.stars.length; i++)
        {
          if (score < this.level.goal.stars[i]) return i;
        }
        break;
    }
    return 3;
  }
  
  // Called when the player dies
  gameover() {
    this.finalScore = Math.floor(this.score);
    this.finalTime = this.time;
    
    user.levels[this.levelId] = {
      completed: user.levels[this.levelId]?.completed || this.getStars(this.finalScore) >= 1,
      highscore: Math.max(user.levels[this.levelId]?.highscore || 0, this.finalScore),
      stars: Math.max(user.levels[this.levelId]?.stars || 0, this.getStars(this.finalScore))
    };
    
    this.state = 'gameover';
  }
  
  // Add a new entity to the scene
  addEntity(entity: Entity) {
    this.entities.push(entity);
  }
  
}

