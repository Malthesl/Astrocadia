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
  levels: {}
};

// TODO: Saving/Loading