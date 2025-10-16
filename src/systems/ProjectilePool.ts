import { Projectile } from '../entities/Projectile';
import { Vec2 } from '../types/Vec2';
import { EntityID } from '../types';

/**
 * ProjectilePool manages a pool of pre-allocated projectiles for performance.
 * Reduces garbage collection by reusing projectile instances.
 */
export class ProjectilePool {
  private pool: Projectile[] = [];
  private activeProjectiles: Set<Projectile> = new Set();
  private nextId: EntityID = 10000; // Start projectile IDs at 10000 to avoid conflicts

  /**
   * Create a new projectile pool
   * @param initialSize - Number of projectiles to pre-allocate
   */
  constructor(initialSize: number = 100) {
    this.preallocate(initialSize);
  }

  /**
   * Pre-allocate projectiles for the pool
   */
  private preallocate(count: number): void {
    for (let i = 0; i < count; i++) {
      const projectile = new Projectile(
        this.nextId++,
        new Vec2(0, 0),
        new Vec2(1, 0),
        0,
        0,
        0,
        0
      );
      projectile.deactivate(); // Start inactive
      this.pool.push(projectile);
    }
  }

  /**
   * Acquire a projectile from the pool
   * @param position - Starting position
   * @param direction - Direction to travel (will be normalized)
   * @param owner - Entity ID that fired this projectile
   * @param damage - Damage to deal on hit
   * @param speed - Speed in pixels per second
   * @param lifetime - Lifetime in seconds
   * @returns A projectile instance, or null if pool is exhausted
   */
  acquire(
    position: Vec2,
    direction: Vec2,
    owner: EntityID,
    damage: number,
    speed: number,
    lifetime: number = 3.0
  ): Projectile | null {
    let projectile: Projectile | undefined;

    // Try to get an inactive projectile from the pool
    if (this.pool.length > 0) {
      projectile = this.pool.pop();
    } else {
      // Pool exhausted - create a new one (expand pool dynamically)
      projectile = new Projectile(
        this.nextId++,
        new Vec2(0, 0),
        new Vec2(1, 0),
        0,
        0,
        0,
        0
      );
    }

    if (!projectile) return null;

    // Reset and activate the projectile
    projectile.reset(position, direction, owner, damage, speed, lifetime);
    this.activeProjectiles.add(projectile);

    return projectile;
  }

  /**
   * Release a projectile back to the pool
   * @param projectile - The projectile to release
   */
  release(projectile: Projectile): void {
    if (!this.activeProjectiles.has(projectile)) return;

    projectile.deactivate();
    this.activeProjectiles.delete(projectile);
    this.pool.push(projectile);
  }

  /**
   * Update all active projectiles and return inactive ones to the pool
   */
  update(): void {
    const toRelease: Projectile[] = [];

    for (const projectile of this.activeProjectiles) {
      if (!projectile.active) {
        toRelease.push(projectile);
      }
    }

    // Release inactive projectiles back to pool
    for (const projectile of toRelease) {
      this.release(projectile);
    }
  }

  /**
   * Get all active projectiles
   */
  getActiveProjectiles(): Projectile[] {
    return Array.from(this.activeProjectiles);
  }

  /**
   * Get pool statistics
   */
  getStats(): { active: number; pooled: number; total: number } {
    return {
      active: this.activeProjectiles.size,
      pooled: this.pool.length,
      total: this.activeProjectiles.size + this.pool.length,
    };
  }

  /**
   * Clear all projectiles
   */
  clear(): void {
    // Return all active projectiles to pool
    for (const projectile of this.activeProjectiles) {
      projectile.deactivate();
      this.pool.push(projectile);
    }
    this.activeProjectiles.clear();
  }

  /**
   * Reset the pool (for level transitions)
   */
  reset(): void {
    this.clear();
  }
}
