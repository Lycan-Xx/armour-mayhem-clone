import { Vec2 } from '../types/Vec2';

/**
 * Particle class representing a single particle
 */
class Particle {
  position: Vec2;
  velocity: Vec2;
  lifetime: number;
  maxLifetime: number;
  color: string;
  size: number;
  active: boolean;

  constructor() {
    this.position = new Vec2(0, 0);
    this.velocity = new Vec2(0, 0);
    this.lifetime = 0;
    this.maxLifetime = 1;
    this.color = '#FFFFFF';
    this.size = 2;
    this.active = false;
  }

  /**
   * Reset particle with new properties
   */
  reset(
    position: Vec2,
    velocity: Vec2,
    lifetime: number,
    color: string,
    size: number
  ): void {
    this.position = position.clone();
    this.velocity = velocity.clone();
    this.lifetime = lifetime;
    this.maxLifetime = lifetime;
    this.color = color;
    this.size = size;
    this.active = true;
  }

  /**
   * Update particle
   */
  update(dt: number): void {
    if (!this.active) return;

    // Update position
    this.position.x += this.velocity.x * dt;
    this.position.y += this.velocity.y * dt;

    // Apply gravity to particles
    this.velocity.y += 500 * dt; // Light gravity

    // Decrease lifetime
    this.lifetime -= dt;
    if (this.lifetime <= 0) {
      this.active = false;
    }
  }

  /**
   * Render particle
   */
  render(ctx: CanvasRenderingContext2D): void {
    if (!this.active) return;

    // Calculate alpha based on lifetime
    const alpha = Math.min(1, this.lifetime / this.maxLifetime);

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

/**
 * ParticleSystem manages a pool of particles for visual effects
 */
export class ParticleSystem {
  private particles: Particle[] = [];
  private readonly POOL_SIZE = 200;

  constructor() {
    // Pre-allocate particle pool
    for (let i = 0; i < this.POOL_SIZE; i++) {
      this.particles.push(new Particle());
    }
  }

  /**
   * Spawn a muzzle flash effect
   */
  spawnMuzzleFlash(position: Vec2, direction: Vec2): void {
    const particleCount = 8;
    const baseAngle = Math.atan2(direction.y, direction.x);

    for (let i = 0; i < particleCount; i++) {
      const angle = baseAngle + (Math.random() - 0.5) * Math.PI / 3;
      const speed = 100 + Math.random() * 100;
      const velocity = new Vec2(
        Math.cos(angle) * speed,
        Math.sin(angle) * speed
      );

      this.spawnParticle(
        position,
        velocity,
        0.2, // Short lifetime
        '#FFA500', // Orange
        3 + Math.random() * 2
      );
    }
  }

  /**
   * Spawn hit spark effect
   */
  spawnHitSparks(position: Vec2, direction: Vec2): void {
    const particleCount = 12;
    const baseAngle = Math.atan2(direction.y, direction.x) + Math.PI; // Opposite direction

    for (let i = 0; i < particleCount; i++) {
      const angle = baseAngle + (Math.random() - 0.5) * Math.PI;
      const speed = 150 + Math.random() * 150;
      const velocity = new Vec2(
        Math.cos(angle) * speed,
        Math.sin(angle) * speed
      );

      // Random colors for sparks
      const colors = ['#FFFF00', '#FFA500', '#FF6600', '#FFFFFF'];
      const color = colors[Math.floor(Math.random() * colors.length)] || '#FFFFFF';

      this.spawnParticle(
        position,
        velocity,
        0.3 + Math.random() * 0.2,
        color,
        2 + Math.random() * 2
      );
    }
  }

  /**
   * Spawn dust particles (for landing)
   */
  spawnDust(position: Vec2): void {
    const particleCount = 6;

    for (let i = 0; i < particleCount; i++) {
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI / 2; // Upward spread
      const speed = 50 + Math.random() * 50;
      const velocity = new Vec2(
        Math.cos(angle) * speed,
        Math.sin(angle) * speed
      );

      this.spawnParticle(
        position,
        velocity,
        0.5 + Math.random() * 0.3,
        '#8B7355', // Brown dust color
        2 + Math.random() * 2
      );
    }
  }

  /**
   * Spawn a single particle
   */
  private spawnParticle(
    position: Vec2,
    velocity: Vec2,
    lifetime: number,
    color: string,
    size: number
  ): void {
    // Find an inactive particle
    for (const particle of this.particles) {
      if (!particle.active) {
        particle.reset(position, velocity, lifetime, color, size);
        return;
      }
    }
    // Pool exhausted - particle not spawned
  }

  /**
   * Update all particles
   */
  update(dt: number): void {
    for (const particle of this.particles) {
      if (particle.active) {
        particle.update(dt);
      }
    }
  }

  /**
   * Render all particles
   */
  render(ctx: CanvasRenderingContext2D): void {
    for (const particle of this.particles) {
      if (particle.active) {
        particle.render(ctx);
      }
    }
  }

  /**
   * Get particle statistics
   */
  getStats(): { active: number; total: number } {
    let active = 0;
    for (const particle of this.particles) {
      if (particle.active) active++;
    }
    return { active, total: this.particles.length };
  }

  /**
   * Clear all particles
   */
  clear(): void {
    for (const particle of this.particles) {
      particle.active = false;
    }
  }
}
