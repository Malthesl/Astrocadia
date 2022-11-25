// Handles vectors
export class Vec2 {
  x: number;
  y: number;
  
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
  
  // Creates a unit vector with a direction
  static direction(rad: number) {
    return new Vec2(Math.cos(rad), Math.sin(rad));
  }
  
  // Multiplies the vector by a number
  mul(mul: number) {
    this.x *= mul;
    this.y *= mul;
    
    return this;
  }
}