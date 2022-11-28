import { user } from './user.js';
import { scenes, setScene } from './main.js';
import { IngameScene } from './ingame.js';

export interface LevelMeta {
  id: string;
  name: string;
}

// Levels
export const levels: {[id: string]: LevelMeta} = {
  'level-1': {
    id: 'level-1',
    name: 'Level 1',
  },
};

export const levelList = Object.keys(levels);

interface LevelInfo {
  status: 'completed' | 'unlocked' | 'locked';
  stars: number;
}

// Get (player) info about a level
export function getLevelInfo(id: string): LevelInfo {
  const ro = <LevelInfo>{
    status: 'locked',
    stars: user.levels[id]?.stars || 0
  };
  
  if (user.levels[id]?.completed)
    ro.status = 'completed';
  else if (levelList[levelList.indexOf(id) - 1] === undefined || user.levels[levelList[levelList.indexOf(id) - 1]]?.completed)
    ro.status = 'unlocked';
  
  return ro;
}

// Get the next level
export function getCurrentPlayerLevel() {
  for (let i = 0; i < levelList.length; i++)
  {
    if (getLevelInfo(levelList[i]).status === 'unlocked') return levelList[i];
  }
}

// Start a level
export function startLevel(id: string) {
  scenes['ingame'] = new IngameScene(id);
  
  setScene('ingame');
}