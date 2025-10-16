import { Entity } from '../entities/Entity';

/**
 * Collision callback function type
 */
export type CollisionCallback = (entityA: Entity, entityB: Entity) => void;

/**
 * CollisionSystem handles entity-to-entity collision detection and response.
 * Uses AABB (Axis-Aligned Bounding Box) collision detection with callbacks.
 */
export class CollisionSystem {
  private collisionCallbacks: Map<string, CollisionCallback[]> = new Map();

  /**
   * Register a collision callback for specific tag pairs
   * @param tagA - First entity tag to check
   * @param tagB - Second entity tag to check
   * @param callback - Function to call when collision occurs
   */
  onCollision(tagA: string, tagB: string, callback: CollisionCallback): void {
    const key = this.getCollisionKey(tagA, tagB);
    
    if (!this.collisionCallbacks.has(key)) {
      this.collisionCallbacks.set(key, []);
    }
    
    this.collisionCallbacks.get(key)!.push(callback);
  }

  /**
   * Detect and handle collisions between entities
   * @param entities - Array of entities to check for collisions
   */
  detectCollisions(entities: Entity[]): void {
    // Broad-phase: check all entity pairs
    for (let i = 0; i < entities.length; i++) {
      const entityA = entities[i];
      if (!entityA || !entityA.active) continue;

      for (let j = i + 1; j < entities.length; j++) {
        const entityB = entities[j];
        if (!entityB || !entityB.active) continue;

        // AABB collision test
        const boundsA = entityA.getBounds();
        const boundsB = entityB.getBounds();

        if (boundsA.intersects(boundsB)) {
          // Collision detected - trigger callbacks
          this.handleCollision(entityA, entityB);
        }
      }
    }
  }

  /**
   * Handle collision between two entities by invoking registered callbacks
   */
  private handleCollision(entityA: Entity, entityB: Entity): void {
    // Check all tag combinations and invoke matching callbacks
    for (const tagA of entityA.tags) {
      for (const tagB of entityB.tags) {
        // Check both orderings (A-B and B-A)
        const keyAB = this.getCollisionKey(tagA, tagB);
        const keyBA = this.getCollisionKey(tagB, tagA);

        // Invoke callbacks for A-B ordering
        const callbacksAB = this.collisionCallbacks.get(keyAB);
        if (callbacksAB) {
          for (const callback of callbacksAB) {
            callback(entityA, entityB);
          }
        }

        // Invoke callbacks for B-A ordering (if different)
        if (keyAB !== keyBA) {
          const callbacksBA = this.collisionCallbacks.get(keyBA);
          if (callbacksBA) {
            for (const callback of callbacksBA) {
              callback(entityB, entityA);
            }
          }
        }
      }
    }
  }

  /**
   * Generate a unique key for a tag pair
   */
  private getCollisionKey(tagA: string, tagB: string): string {
    // Sort tags alphabetically for consistent key generation
    return tagA < tagB ? `${tagA}:${tagB}` : `${tagB}:${tagA}`;
  }

  /**
   * Clear all collision callbacks
   */
  clearCallbacks(): void {
    this.collisionCallbacks.clear();
  }

  /**
   * Remove callbacks for a specific tag pair
   */
  removeCallbacks(tagA: string, tagB: string): void {
    const key = this.getCollisionKey(tagA, tagB);
    this.collisionCallbacks.delete(key);
  }
}
