// Save file format
interface UserSave {
  levels: {[id: string]: LevelSave};
}

interface LevelSave {
  stars: number;
  completed: boolean;
}

// user/save object
export let user: UserSave = {
  levels: {
    '1': {
      stars: 1,
      completed: true
    },
    '2': {
      stars: 2,
      completed: true
    },
    '3': {
      stars: 3,
      completed: true
    }
  }
};

// TODO: Saving/Loading