import { Entity } from './Entity';
import { Vec2 } from '../types/Vec2';
import { EntityID } from '../types';

/**
 * Projectile entity representing bullets and pellets fired from weapons.
 * Moves in a straight line and despawns after hitting something or timing out.
 */
export class Projectile extends Entity {
  owner: EntityID; // Entity that fired this projectile
  damage: number;
  lifetime: number; // Remaining lifetime in seconds
  maxLifetime: number; // Maximum lifetime for fade calculation
  speed: number;

  constructor(
    id: EntityID,
    position: Vec2,
    direction: Vec2,
    owner: EntityID,
    damage: number,
    speed: number,
    lifetime: number = 3.0 // Default 3 seconds
  ) {
    super(id, position, new Vec2(4, 4)); // Small 4x4 projectile
    
    this.owner = owner;
    this.damage = damage;
    this.speed = speed;
    this.lifetime = lifetime;
    this.maxLifetime = lifetime;
    
    // Set velocity based on direction and speed
    this.velocity = direction.normalize().multiply(speed);
    
    // Add projectile tag for collision detection
    this.addTag('projectile');
  }

  /**
   * Update projectile position and lifetime
   */
  update(dt: number): void {
    // Decrease lifetime
    this.lifetime -= dt;
    
    // Despawn if lifetime expired
    if (this.lifetime <= 0) {
      this.deactivate();
      return;
    }
    
    // Movement is handled by velocity (no need to manually update position)
    // Physics system will integrate velocity into position
  }

  /**
   * Render the projectile as a small circle
   */
  render(ctx: CanvasRenderingContext2D): void {
    const centerX = this.position.x + this.size.x / 2;
    const centerY = this.position.y + this.size.y / 2;
    const radius = this.size.x / 2;
    
    // Calculate alpha based on remaining lifetime (fade out near end)
    const lifetimeRatio = this.lifetime / this.maxLifetime;
    const alpha = Math.min(1, lifetimeRatio * 2); // Fade in last 50% of lifetime
    
    ctx.save();
    ctx.globalAlpha = alpha;
    
    // Draw projectile as yellow circle
    ctx.fillStyle = '#FFD700'; // Gold color
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fill();
    
    // Add glow effect
    ctx.strokeStyle = '#FFA500'; // Orange glow
    ctx.lineWidth = 1;
    ctx.stroke();
    
    ctx.restore();
  }

  /**
   * Handle collision with another entity
   * @param target - The entity that was hit
   */
  onHit(target: Entity): void {
    // Don't hit the owner
    if (target.id === this.owner) return;
    
    // Deactivate projectile on hit
    this.deactivate();
    
    // Damage will be applied by the collision system callback
  }

  /**
   * Reset projectile for object pooling
   */
  reset(
    position: Vec2,
    direction: Vec2,
    owner: EntityID,
    damage: number,
    speed: number,
    lifetime: number = 3.0
  ): void {
    this.position = position.clone();
    this.owner = owner;
    this.damage = damage;
    this.speed = speed;
    this.lifetime = lifetime;
    this.maxLifetime = lifetime;
    this.velocity = direction.normalize().multiply(speed);
    this.activate();
  }
}
