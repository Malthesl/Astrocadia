import { user } from './user.js';
import { scenes, setScene } from './main.js';
import { IngameScene } from './ingame.js';

export interface Level {
  id: string;
  name: string;
}

// Levels
export const levels: {[id: string]: Level} = {
  '1': {
    id: '1',
    name: 'Level 1',
  },
  '2': {
    id: '2',
    name: 'Level 2',
  },
  '3': {
    id: '3',
    name: 'Level 3',
  },
  '4': {
    id: '4',
    name: 'Level 4',
  },
  '5': {
    id: '5',
    name: 'Level 5',
  },
  '6': {
    id: '6',
    name: 'Level 6',
  },
  '7': {
    id: '7',
    name: 'Level 7',
  },
  '8': {
    id: '8',
    name: 'Level 8',
  },
  '9': {
    id: '9',
    name: 'Level 9',
  },
  '10': {
    id: '10',
    name: 'Level 10',
  },
  '11': {
    id: '11',
    name: 'Level 11',
  },
  '12': {
    id: '12',
    name: 'Level 12',
  },
  '13': {
    id: '13',
    name: 'Level 13',
  },
  '14': {
    id: '14',
    name: 'Level 14',
  },
  '15': {
    id: '15',
    name: 'Level 15',
  },
  '16': {
    id: '16',
    name: 'Level 16',
  },
  '17': {
    id: '17',
    name: 'Level 17',
  },
  '18': {
    id: '18',
    name: 'Level 18',
  },
  '19': {
    id: '19',
    name: 'Level 19',
  },
  '20': {
    id: '20',
    name: 'Level 20',
  }
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