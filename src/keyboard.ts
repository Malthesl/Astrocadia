/**
 * handles keyboard input
 */

// Each key is either true or false (or undefined), for pressed down or not
export const keys: {[keyCode: string]: boolean} = {};
export const pressed: {[keyCode: string]: boolean} = {};

window.addEventListener('keydown', e => {
  keys[e.code] = true;
  keys.any = true;
  if (!e.repeat)
  {
    pressed[e.code] = true;
    pressed.any = true;
  }
});

window.addEventListener('keyup', e => {
  keys[e.code] = false;
  keys.any = false;
});