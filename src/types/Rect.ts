import { Vec2 } from './Vec2';

/**
 * Rectangle class for bounding boxes and AABB collision detection
 */
export class Rect {
  constructor(
    public x: number = 0,
    public y: number = 0,
    public width: number = 0,
    public height: number = 0
  ) {}

  /**
   * Get the left edge x-coordinate
   */
  get left(): number {
    return this.x;
  }

  /**
   * Get the right edge x-coordinate
   */
  get right(): number {
    return this.x + this.width;
  }

  /**
   * Get the top edge y-coordinate
   */
  get top(): number {
    return this.y;
  }

  /**
   * Get the bottom edge y-coordinate
   */
  get bottom(): number {
    return this.y + this.height;
  }

  /**
   * Get the center point of the rectangle
   */
  get center(): Vec2 {
    return new Vec2(this.x + this.width / 2, this.y + this.height / 2);
  }

  /**
   * Check if this rectangle overlaps with another rectangle (AABB collision)
   */
  overlaps(other: Rect): boolean {
    return (
      this.left < other.right &&
      this.right > other.left &&
      this.top < other.bottom &&
      this.bottom > other.top
    );
  }

  /**
   * Check if a point is inside this rectangle
   */
  contains(point: Vec2): boolean {
    return (
      point.x >= this.left &&
      point.x <= this.right &&
      point.y >= this.top &&
      point.y <= this.bottom
    );
  }

  /**
   * Create a Rect from a position and size
   */
  static fromPositionAndSize(position: Vec2, size: Vec2): Rect {
    return new Rect(position.x, position.y, size.x, size.y);
  }

  /**
   * Create a copy of this rectangle
   */
  clone(): Rect {
    return new Rect(this.x, this.y, this.width, this.height);
  }
}
