import { Vec2 } from '../types/Vec2';
import { Entity } from '../entities/Entity';

/**
 * Camera handles viewport positioning and world-to-screen coordinate transformation.
 * Follows a target entity with deadzone and boundary constraints.
 */
export class Camera {
  position: Vec2;
  private viewportWidth: number;
  private viewportHeight: number;
  private deadzone: { x: number; y: number };
  private bounds: { minX: number; minY: number; maxX: number; maxY: number } | null = null;

  constructor(viewportWidth: number, viewportHeight: number) {
    this.position = new Vec2(0, 0);
    this.viewportWidth = viewportWidth;
    this.viewportHeight = viewportHeight;
    
    // Deadzone: camera won't move if target is within this area
    this.deadzone = {
      x: viewportWidth * 0.2, // 20% of viewport width
      y: viewportHeight * 0.2, // 20% of viewport height
    };
  }

  /**
   * Set the level bounds to constrain camera movement
   */
  setBounds(width: number, height: number): void {
    this.bounds = {
      minX: 0,
      minY: 0,
      maxX: Math.max(0, width - this.viewportWidth),
      maxY: Math.max(0, height - this.viewportHeight),
    };
  }

  /**
   * Clear camera bounds
   */
  clearBounds(): void {
    this.bounds = null;
  }

  /**
   * Update camera to follow a target entity
   */
  follow(target: Entity): void {
    // Calculate target position in screen space
    const targetScreenX = target.position.x - this.position.x;
    const targetScreenY = target.position.y - this.position.y;

    // Calculate deadzone boundaries
    const deadzoneLeft = this.viewportWidth / 2 - this.deadzone.x / 2;
    const deadzoneRight = this.viewportWidth / 2 + this.deadzone.x / 2;
    const deadzoneTop = this.viewportHeight / 2 - this.deadzone.y / 2;
    const deadzoneBottom = this.viewportHeight / 2 + this.deadzone.y / 2;

    // Move camera if target is outside deadzone
    if (targetScreenX < deadzoneLeft) {
      this.position.x += targetScreenX - deadzoneLeft;
    } else if (targetScreenX > deadzoneRight) {
      this.position.x += targetScreenX - deadzoneRight;
    }

    if (targetScreenY < deadzoneTop) {
      this.position.y += targetScreenY - deadzoneTop;
    } else if (targetScreenY > deadzoneBottom) {
      this.position.y += targetScreenY - deadzoneBottom;
    }

    // Apply bounds constraints
    if (this.bounds) {
      this.position.x = Math.max(this.bounds.minX, Math.min(this.bounds.maxX, this.position.x));
      this.position.y = Math.max(this.bounds.minY, Math.min(this.bounds.maxY, this.position.y));
    }
  }

  /**
   * Convert world coordinates to screen coordinates
   */
  worldToScreen(worldPos: Vec2): Vec2 {
    return new Vec2(
      worldPos.x - this.position.x,
      worldPos.y - this.position.y
    );
  }

  /**
   * Convert screen coordinates to world coordinates
   */
  screenToWorld(screenPos: Vec2): Vec2 {
    return new Vec2(
      screenPos.x + this.position.x,
      screenPos.y + this.position.y
    );
  }

  /**
   * Apply camera transformation to rendering context
   */
  applyTransform(ctx: CanvasRenderingContext2D): void {
    ctx.translate(-this.position.x, -this.position.y);
  }

  /**
   * Reset camera transformation
   */
  resetTransform(ctx: CanvasRenderingContext2D): void {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }

  /**
   * Check if a position is visible in the camera viewport
   */
  isVisible(worldPos: Vec2, margin: number = 0): boolean {
    const screenPos = this.worldToScreen(worldPos);
    return (
      screenPos.x >= -margin &&
      screenPos.x <= this.viewportWidth + margin &&
      screenPos.y >= -margin &&
      screenPos.y <= this.viewportHeight + margin
    );
  }

  /**
   * Update viewport size (for window resize)
   */
  setViewportSize(width: number, height: number): void {
    this.viewportWidth = width;
    this.viewportHeight = height;
    
    // Update deadzone
    this.deadzone = {
      x: width * 0.2,
      y: height * 0.2,
    };
  }

  /**
   * Get viewport dimensions
   */
  getViewportSize(): { width: number; height: number } {
    return {
      width: this.viewportWidth,
      height: this.viewportHeight,
    };
  }

  /**
   * Center camera on a position
   */
  centerOn(worldPos: Vec2): void {
    this.position.x = worldPos.x - this.viewportWidth / 2;
    this.position.y = worldPos.y - this.viewportHeight / 2;

    // Apply bounds constraints
    if (this.bounds) {
      this.position.x = Math.max(this.bounds.minX, Math.min(this.bounds.maxX, this.position.x));
      this.position.y = Math.max(this.bounds.minY, Math.min(this.bounds.maxY, this.position.y));
    }
  }
}
