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
  
  static dist(a: {x: number, y: number} | Vec2, b: {x: number, y: number} | Vec2) {
    return Vec2.from(a).distTo(Vec2.from(b));
  }
  
  static from(vectorLikeObject: {x: number, y: number}) {
    return new Vec2(vectorLikeObject.x, vectorLikeObject.y);
  }
  
  // Multiplies the vector by a number
  mul(mul: number) {
    this.x *= mul;
    this.y *= mul;
    
    return this;
  }
  
  distTo(vec: Vec2) {
    return Math.sqrt((this.x - vec.x) ** 2 + (this.y - vec.y) ** 2);
  }
}