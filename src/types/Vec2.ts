/**
 * 2D Vector class for position, velocity, and direction calculations
 */
export class Vec2 {
  constructor(public x: number = 0, public y: number = 0) {}

  /**
   * Add another vector to this vector and return a new Vec2
   */
  add(other: Vec2): Vec2 {
    return new Vec2(this.x + other.x, this.y + other.y);
  }

  /**
   * Subtract another vector from this vector and return a new Vec2
   */
  subtract(other: Vec2): Vec2 {
    return new Vec2(this.x - other.x, this.y - other.y);
  }

  /**
   * Multiply this vector by a scalar and return a new Vec2
   */
  multiply(scalar: number): Vec2 {
    return new Vec2(this.x * scalar, this.y * scalar);
  }

  /**
   * Get the length (magnitude) of this vector
   */
  length(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  /**
   * Return a normalized version of this vector (length = 1)
   */
  normalize(): Vec2 {
    const len = this.length();
    if (len === 0) return new Vec2(0, 0);
    return new Vec2(this.x / len, this.y / len);
  }

  /**
   * Calculate the distance between this vector and another
   */
  distance(other: Vec2): number {
    const dx = this.x - other.x;
    const dy = this.y - other.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * Create a copy of this vector
   */
  clone(): Vec2 {
    return new Vec2(this.x, this.y);
  }

  /**
   * Set the x and y values of this vector
   */
  set(x: number, y: number): void {
    this.x = x;
    this.y = y;
  }
}
