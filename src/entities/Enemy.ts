import { Entity } from './Entity';
import { Player } from './Player';
import { Vec2 } from '../types/Vec2';
import { EntityID, AIState, WeaponDef } from '../types';
import { WeaponSystem } from '../systems/WeaponSystem';

/**
 * Enemy entity with AI behavior.
 * Patrols, chases player when detected, and attacks when in range.
 */
export class Enemy extends Entity {
  health: number;
  maxHealth: number;
  aiState: AIState;
  sightRadius: number;
  attackRange: number;
  patrolPoints: Vec2[];
  currentPatrolIndex: number;
  attackCooldown: number;
  
  private weaponSystem: WeaponSystem;
  private onShootCallback?: (projectiles: any[]) => void;
  private readonly MOVE_SPEED = 150; // pixels per second
  private readonly ATTACK_COOLDOWN_TIME = 2.0; // seconds between attacks
  private readonly PATROL_WAIT_TIME = 1.0; // seconds to wait at patrol points
  private patrolWaitTimer: number = 0;

  constructor(
    id: EntityID,
    position: Vec2,
    weaponSystem: WeaponSystem,
    weapon: WeaponDef,
    patrolPoints: Vec2[] = []
  ) {
    super(id, position, new Vec2(32, 48)); // Same size as player
    
    this.health = 100;
    this.maxHealth = 100;
    this.aiState = AIState.IDLE;
    this.sightRadius = 400; // Can see player within 400 pixels
    this.attackRange = 300; // Attack when player within 300 pixels
    this.patrolPoints = patrolPoints.length > 0 ? patrolPoints : [position.clone()];
    this.currentPatrolIndex = 0;
    this.attackCooldown = 0;
    
    this.weaponSystem = weaponSystem;
    
    // Add tags
    this.addTag('enemy');
    this.addTag('physics'); // Enable physics
    
    // Register weapon
    weaponSystem.registerWeapon(this.id, weapon);
    
    // Start with patrol if we have patrol points
    if (patrolPoints.length > 1) {
      this.aiState = AIState.PATROL;
    }
  }

  /**
   * Update enemy AI and behavior
   */
  update(dt: number): void {
    // Update attack cooldown
    if (this.attackCooldown > 0) {
      this.attackCooldown -= dt;
    }
    
    // AI behavior is updated externally by passing player reference
    // This is just for internal state management
  }

  /**
   * Update AI behavior based on player position
   * This should be called by the game engine with player reference
   */
  updateAI(dt: number, player: Player): void {
    const distanceToPlayer = this.position.distance(player.position);
    
    // State transitions
    switch (this.aiState) {
      case AIState.IDLE:
        if (distanceToPlayer <= this.sightRadius) {
          this.aiState = AIState.CHASE;
        } else if (this.patrolPoints.length > 1) {
          this.aiState = AIState.PATROL;
        }
        break;
        
      case AIState.PATROL:
        if (distanceToPlayer <= this.sightRadius) {
          this.aiState = AIState.CHASE;
        } else {
          this.doPatrol(dt);
        }
        break;
        
      case AIState.CHASE:
        if (distanceToPlayer > this.sightRadius * 1.5) {
          // Lost sight of player
          this.aiState = AIState.PATROL;
        } else if (distanceToPlayer <= this.attackRange) {
          this.aiState = AIState.ATTACK;
        } else {
          this.doChase(player);
        }
        break;
        
      case AIState.ATTACK:
        if (distanceToPlayer > this.attackRange) {
          this.aiState = AIState.CHASE;
        } else {
          this.doAttack(player);
        }
        break;
    }
  }

  /**
   * Patrol behavior: move between waypoints
   */
  private doPatrol(dt: number): void {
    if (this.patrolPoints.length <= 1) return;
    
    const targetPoint = this.patrolPoints[this.currentPatrolIndex];
    if (!targetPoint) return;
    
    const distance = this.position.distance(targetPoint);
    
    if (distance < 10) {
      // Reached patrol point - wait before moving to next
      this.patrolWaitTimer += dt;
      this.velocity.x = 0; // Stop moving
      
      if (this.patrolWaitTimer >= this.PATROL_WAIT_TIME) {
        // Move to next patrol point
        this.currentPatrolIndex = (this.currentPatrolIndex + 1) % this.patrolPoints.length;
        this.patrolWaitTimer = 0;
      }
    } else {
      // Move toward patrol point
      const direction = targetPoint.subtract(this.position).normalize();
      this.velocity.x = direction.x * this.MOVE_SPEED;
      // Y velocity is handled by physics (gravity)
    }
  }

  /**
   * Chase behavior: move toward player
   */
  private doChase(player: Player): void {
    const direction = player.position.subtract(this.position).normalize();
    this.velocity.x = direction.x * this.MOVE_SPEED;
    // Y velocity is handled by physics (gravity/jumping would be added here)
  }

  /**
   * Attack behavior: shoot at player
   */
  private doAttack(player: Player): void {
    // Stop moving while attacking
    this.velocity.x = 0;
    
    // Attack if cooldown is ready
    if (this.attackCooldown <= 0) {
      this.shoot(player);
      this.attackCooldown = this.ATTACK_COOLDOWN_TIME;
    }
  }

  /**
   * Shoot at the player
   */
  private shoot(player: Player): void {
    const enemyCenter = new Vec2(
      this.position.x + this.size.x / 2,
      this.position.y + this.size.y / 2
    );
    
    const playerCenter = new Vec2(
      player.position.x + player.size.x / 2,
      player.position.y + player.size.y / 2
    );
    
    const direction = playerCenter.subtract(enemyCenter).normalize();
    
    // Fire weapon through weapon system
    const projectiles = this.weaponSystem.fire(this.id, enemyCenter, direction);
    
    // Notify callback if projectiles were spawned
    if (projectiles.length > 0 && this.onShootCallback) {
      this.onShootCallback(projectiles);
    }
  }
  
  /**
   * Set callback for when enemy shoots
   */
  setOnShootCallback(callback: (projectiles: any[]) => void): void {
    this.onShootCallback = callback;
  }

  /**
   * Take damage
   */
  takeDamage(amount: number): void {
    this.health -= amount;
    
    if (this.health <= 0) {
      this.health = 0;
      this.deactivate(); // Enemy dies
    }
  }

  /**
   * Render the enemy
   */
  render(ctx: CanvasRenderingContext2D): void {
    // Draw enemy body as rectangle
    ctx.fillStyle = '#E24A4A'; // Red color
    ctx.fillRect(this.position.x, this.position.y, this.size.x, this.size.y);
    
    // Draw enemy outline
    ctx.strokeStyle = '#8A2E2E';
    ctx.lineWidth = 2;
    ctx.strokeRect(this.position.x, this.position.y, this.size.x, this.size.y);
    
    // Draw direction indicator (small triangle)
    const centerX = this.position.x + this.size.x / 2;
    const centerY = this.position.y + this.size.y / 2;
    const indicatorSize = 8;
    const dirX = this.velocity.x >= 0 ? 1 : -1;
    
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.moveTo(centerX + dirX * indicatorSize, centerY);
    ctx.lineTo(centerX - dirX * indicatorSize / 2, centerY - indicatorSize / 2);
    ctx.lineTo(centerX - dirX * indicatorSize / 2, centerY + indicatorSize / 2);
    ctx.closePath();
    ctx.fill();
    
    // Draw health bar above enemy
    this.drawHealthBar(ctx);
    
    // Draw AI state indicator (for debugging)
    this.drawStateIndicator(ctx);
  }

  /**
   * Draw health bar above the enemy
   */
  private drawHealthBar(ctx: CanvasRenderingContext2D): void {
    const barWidth = this.size.x;
    const barHeight = 4;
    const barX = this.position.x;
    const barY = this.position.y - 10;
    
    // Background (red)
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(barX, barY, barWidth, barHeight);
    
    // Foreground (green) based on health percentage
    const healthPercent = this.health / this.maxHealth;
    ctx.fillStyle = '#00FF00';
    ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight);
    
    // Border
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1;
    ctx.strokeRect(barX, barY, barWidth, barHeight);
  }

  /**
   * Draw AI state indicator
   */
  private drawStateIndicator(ctx: CanvasRenderingContext2D): void {
    const x = this.position.x + this.size.x / 2;
    const y = this.position.y - 20;
    
    let color = '#FFFFFF';
    switch (this.aiState) {
      case AIState.IDLE:
        color = '#CCCCCC';
        break;
      case AIState.PATROL:
        color = '#4A90E2';
        break;
      case AIState.CHASE:
        color = '#FFA500';
        break;
      case AIState.ATTACK:
        color = '#FF0000';
        break;
    }
    
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI * 2);
    ctx.fill();
  }
}
