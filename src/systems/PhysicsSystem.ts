import { Entity } from '../entities/Entity';
import { Rect } from '../types/Rect';

/**
 * Platform data structure for collision detection
 */
export interface Platform {
  x: number;
  y: number;
  width: number;
  height: number;
  oneWay?: boolean; // Can jump through from below
}

/**
 * PhysicsSystem handles gravity, velocity integration, and platform collisions.
 * Applies realistic physics to entities with proper collision resolution.
 */
export class PhysicsSystem {
  private readonly GRAVITY = 980; // pixels per second squared (roughly Earth gravity scaled)
  private readonly GROUND_FRICTION = 0.85; // Friction coefficient when on ground
  private readonly AIR_FRICTION = 0.98; // Minimal air resistance
  
  private platforms: Platform[] = [];

  /**
   * Set the platforms for collision detection
   * @param platforms - Array of platform definitions
   */
  setPlatforms(platforms: Platform[]): void {
    this.platforms = platforms;
  }

  /**
   * Add a platform to the physics system
   * @param platform - Platform to add
   */
  addPlatform(platform: Platform): void {
    this.platforms.push(platform);
  }

  /**
   * Clear all platforms
   */
  clearPlatforms(): void {
    this.platforms = [];
  }

  /**
   * Update physics for all entities with the 'physics' tag
   * @param entities - Array of entities to process
   * @param dt - Delta time in seconds
   */
  update(entities: Entity[], dt: number): void {
    for (const entity of entities) {
      // Only process entities with physics tag
      if (!entity.hasTag('physics')) continue;

      // Apply gravity
      entity.velocity.y += this.GRAVITY * dt;

      // Apply friction
      if (entity.hasTag('grounded')) {
        entity.velocity.x *= this.GROUND_FRICTION;
      } else {
        entity.velocity.x *= this.AIR_FRICTION;
      }

      // Store old position for one-way platform checks
      const oldY = entity.position.y;

      // Integrate velocity into position
      entity.position.x += entity.velocity.x * dt;
      entity.position.y += entity.velocity.y * dt;

      // Get entity bounds after movement
      const entityBounds = entity.getBounds();

      // Check collisions with platforms
      let grounded = false;
      
      for (const platform of this.platforms) {
        const platformBounds = new Rect(
          platform.x,
          platform.y,
          platform.width,
          platform.height
        );

        // Check if entity overlaps with platform
        if (entityBounds.intersects(platformBounds)) {
          // One-way platform logic: only collide from above
          if (platform.oneWay) {
            // Check if entity was above platform before movement
            const wasAbove = oldY + entityBounds.height <= platform.y;
            // Only collide if moving downward and was above
            if (wasAbove && entity.velocity.y >= 0) {
              // Resolve collision: place entity on top of platform
              entity.position.y = platform.y - entityBounds.height;
              entity.velocity.y = 0;
              grounded = true;
            }
          } else {
            // Solid platform: resolve collision on all sides
            this.resolveCollision(entity, entityBounds, platformBounds);
            
            // Check if entity is on top of platform
            if (entity.position.y + entityBounds.height <= platform.y + 5) {
              grounded = true;
            }
          }
        }
      }

      // Update grounded tag
      if (grounded) {
        entity.addTag('grounded');
      } else {
        entity.removeTag('grounded');
      }
    }
  }

  /**
   * Resolve collision between entity and platform
   * Uses AABB collision resolution to push entity out of platform
   */
  private resolveCollision(
    entity: Entity,
    entityBounds: Rect,
    platformBounds: Rect
  ): void {
    // Calculate overlap on each axis
    const overlapLeft = (entityBounds.x + entityBounds.width) - platformBounds.x;
    const overlapRight = (platformBounds.x + platformBounds.width) - entityBounds.x;
    const overlapTop = (entityBounds.y + entityBounds.height) - platformBounds.y;
    const overlapBottom = (platformBounds.y + platformBounds.height) - entityBounds.y;

    // Find minimum overlap
    const minOverlapX = Math.min(overlapLeft, overlapRight);
    const minOverlapY = Math.min(overlapTop, overlapBottom);

    // Resolve on axis with smallest overlap
    if (minOverlapX < minOverlapY) {
      // Resolve horizontally
      if (overlapLeft < overlapRight) {
        // Push left
        entity.position.x = platformBounds.x - entityBounds.width;
      } else {
        // Push right
        entity.position.x = platformBounds.x + platformBounds.width;
      }
      entity.velocity.x = 0;
    } else {
      // Resolve vertically
      if (overlapTop < overlapBottom) {
        // Push up (entity hit platform from above)
        entity.position.y = platformBounds.y - entityBounds.height;
        entity.velocity.y = 0;
      } else {
        // Push down (entity hit platform from below)
        entity.position.y = platformBounds.y + platformBounds.height;
        entity.velocity.y = 0;
      }
    }
  }

  /**
   * Get all platforms
   */
  getPlatforms(): Platform[] {
    return this.platforms;
  }
}
