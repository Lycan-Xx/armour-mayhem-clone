import { Vec2 } from '../types/Vec2';
import { Rect } from '../types/Rect';
import { EntityID } from '../types';

/**
 * Abstract base class for all game entities.
 * Provides common properties and methods for position, velocity, collision, and tagging.
 */
export abstract class Entity {
  id: EntityID;
  position: Vec2;
  velocity: Vec2;
  size: Vec2;
  active: boolean;
  tags: Set<string>;

  constructor(id: EntityID, position: Vec2, size: Vec2) {
    this.id = id;
    this.position = position;
    this.velocity = new Vec2(0, 0);
    this.size = size;
    this.active = true;
    this.tags = new Set<string>();
  }

  /**
   * Update the entity's state for one fixed timestep
   * @param dt - Delta time in seconds (fixed timestep)
   */
  abstract update(dt: number): void;

  /**
   * Render the entity to the canvas
   * @param ctx - Canvas rendering context
   */
  abstract render(ctx: CanvasRenderingContext2D): void;

  /**
   * Get the axis-aligned bounding box for this entity
   * Used for collision detection
   */
  getBounds(): Rect {
    return new Rect(
      this.position.x,
      this.position.y,
      this.size.x,
      this.size.y
    );
  }

  /**
   * Check if this entity has a specific tag
   * @param tag - The tag to check for
   */
  hasTag(tag: string): boolean {
    return this.tags.has(tag);
  }

  /**
   * Add a tag to this entity
   * @param tag - The tag to add
   */
  addTag(tag: string): void {
    this.tags.add(tag);
  }

  /**
   * Remove a tag from this entity
   * @param tag - The tag to remove
   */
  removeTag(tag: string): void {
    this.tags.delete(tag);
  }

  /**
   * Deactivate this entity (soft delete for pooling)
   */
  deactivate(): void {
    this.active = false;
  }

  /**
   * Activate this entity
   */
  activate(): void {
    this.active = true;
  }
}
