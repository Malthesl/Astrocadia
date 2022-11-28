// Save file format
interface UserSave {
  levels: {[id: string]: LevelSave};
}

interface LevelSave {
  stars: number;
  completed: boolean;
  highscore: number;
}

// user/save object
export let user: UserSave = {
  levels: {
    '1': {
      stars: 1,
      highscore: 100,
      completed: true
    }
  }
};

// TODO: Saving/Loading