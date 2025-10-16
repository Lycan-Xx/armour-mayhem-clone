import { Entity } from './Entity';
import { Vec2 } from '../types/Vec2';
import { EntityID, WeaponDef } from '../types';
import { InputManager } from '../engine/InputManager';
import { WeaponSystem } from '../systems/WeaponSystem';

/**
 * Player entity controlled by keyboard and mouse input.
 * Handles movement, jumping, aiming, shooting, and weapon management.
 */
export class Player extends Entity {
  health: number;
  maxHealth: number;
  moveSpeed: number;
  jumpForce: number;
  currentWeaponIndex: number;
  weapons: WeaponDef[];
  aimAngle: number;
  
  // Input and systems
  private inputManager: InputManager;
  private weaponSystem: WeaponSystem;
  private onShootCallback?: (projectiles: any[]) => void;
  
  // Jump mechanics
  private jumpKeyPressed: boolean = false;
  private jumpTimer: number = 0;
  private readonly MAX_JUMP_TIME = 0.3; // Maximum time to hold jump for variable height
  
  // Movement acceleration
  private readonly ACCELERATION = 2000; // pixels per second squared
  private readonly MAX_MOVE_SPEED = 300; // pixels per second

  constructor(
    id: EntityID,
    position: Vec2,
    inputManager: InputManager,
    weaponSystem: WeaponSystem,
    weapons: WeaponDef[]
  ) {
    super(id, position, new Vec2(32, 48)); // 32x48 player size
    
    this.health = 100;
    this.maxHealth = 100;
    this.moveSpeed = 300;
    this.jumpForce = 600;
    this.currentWeaponIndex = 0;
    this.weapons = weapons;
    this.aimAngle = 0;
    
    this.inputManager = inputManager;
    this.weaponSystem = weaponSystem;
    
    // Add tags
    this.addTag('player');
    this.addTag('physics'); // Enable physics
    
    // Register initial weapon
    if (weapons.length > 0 && weapons[0]) {
      weaponSystem.registerWeapon(this.id, weapons[0]);
    }
  }

  /**
   * Update player state based on input
   */
  update(dt: number): void {
    this.handleMovement(dt);
    this.handleJump(dt);
    this.handleAiming();
    this.handleShooting();
    this.handleWeaponSwap();
  }

  /**
   * Handle horizontal movement with smooth acceleration
   */
  private handleMovement(dt: number): void {
    const moveLeft = this.inputManager.isKeyDown('a');
    const moveRight = this.inputManager.isKeyDown('d');
    
    if (moveLeft && !moveRight) {
      // Accelerate left
      this.velocity.x -= this.ACCELERATION * dt;
      if (this.velocity.x < -this.MAX_MOVE_SPEED) {
        this.velocity.x = -this.MAX_MOVE_SPEED;
      }
    } else if (moveRight && !moveLeft) {
      // Accelerate right
      this.velocity.x += this.ACCELERATION * dt;
      if (this.velocity.x > this.MAX_MOVE_SPEED) {
        this.velocity.x = this.MAX_MOVE_SPEED;
      }
    }
    // Friction is applied by PhysicsSystem when grounded
  }

  /**
   * Handle jumping with variable height based on key hold duration
   */
  private handleJump(dt: number): void {
    const jumpKey = this.inputManager.isKeyDown(' '); // Space key
    const isGrounded = this.hasTag('grounded');
    
    if (jumpKey && !this.jumpKeyPressed && isGrounded) {
      // Start jump
      this.velocity.y = -this.jumpForce;
      this.jumpKeyPressed = true;
      this.jumpTimer = 0;
      this.removeTag('grounded'); // Leave ground
    } else if (jumpKey && this.jumpKeyPressed && this.jumpTimer < this.MAX_JUMP_TIME) {
      // Continue jump (variable height)
      this.jumpTimer += dt;
      // Apply additional upward force while holding
      this.velocity.y -= this.jumpForce * 0.5 * dt;
    } else if (!jumpKey) {
      // Released jump key
      this.jumpKeyPressed = false;
      this.jumpTimer = 0;
    }
  }

  /**
   * Handle aiming toward mouse cursor
   */
  private handleAiming(): void {
    const mousePos = this.inputManager.getMousePosition();
    const playerCenter = new Vec2(
      this.position.x + this.size.x / 2,
      this.position.y + this.size.y / 2
    );
    
    // Calculate angle from player to mouse
    const dx = mousePos.x - playerCenter.x;
    const dy = mousePos.y - playerCenter.y;
    this.aimAngle = Math.atan2(dy, dx);
  }

  /**
   * Handle weapon firing
   */
  private handleShooting(): void {
    const fireButton = this.inputManager.isMouseButtonDown(0); // Left mouse button
    
    if (fireButton) {
      this.shoot();
    }
  }

  /**
   * Handle weapon swapping
   */
  private handleWeaponSwap(): void {
    const swapKey = this.inputManager.isKeyDown('f');
    
    // Simple debounce: only swap on key press (not hold)
    // This is a simplified version - a proper implementation would track key state changes
    if (swapKey) {
      this.swapWeapon();
    }
  }

  /**
   * Fire the current weapon
   */
  shoot(): void {
    const weaponPos = new Vec2(
      this.position.x + this.size.x / 2,
      this.position.y + this.size.y / 2
    );
    
    const direction = new Vec2(
      Math.cos(this.aimAngle),
      Math.sin(this.aimAngle)
    );
    
    // WeaponSystem will handle fire rate, ammo, and projectile spawning
    const projectiles = this.weaponSystem.fire(this.id, weaponPos, direction);
    
    // Notify callback if projectiles were spawned
    if (projectiles.length > 0 && this.onShootCallback) {
      this.onShootCallback(projectiles);
    }
  }
  
  /**
   * Set callback for when player shoots
   */
  setOnShootCallback(callback: (projectiles: any[]) => void): void {
    this.onShootCallback = callback;
  }

  /**
   * Swap to the next weapon
   */
  swapWeapon(): void {
    if (this.weapons.length <= 1) return;
    
    this.currentWeaponIndex = (this.currentWeaponIndex + 1) % this.weapons.length;
    const newWeapon = this.weapons[this.currentWeaponIndex];
    if (newWeapon) {
      this.weaponSystem.switchWeapon(this.id, newWeapon);
    }
  }

  /**
   * Take damage and apply knockback
   */
  takeDamage(amount: number, knockbackDir?: Vec2): void {
    this.health -= amount;
    
    if (this.health <= 0) {
      this.health = 0;
      this.deactivate(); // Player dies
    }
    
    // Apply knockback if direction provided
    if (knockbackDir) {
      const knockbackForce = 300;
      this.velocity = this.velocity.add(knockbackDir.normalize().multiply(knockbackForce));
    }
  }

  /**
   * Render the player
   */
  render(ctx: CanvasRenderingContext2D): void {
    // Draw player body as rectangle
    ctx.fillStyle = '#4A90E2'; // Blue color
    ctx.fillRect(this.position.x, this.position.y, this.size.x, this.size.y);
    
    // Draw player outline
    ctx.strokeStyle = '#2E5C8A';
    ctx.lineWidth = 2;
    ctx.strokeRect(this.position.x, this.position.y, this.size.x, this.size.y);
    
    // Draw weapon line (aim indicator)
    const centerX = this.position.x + this.size.x / 2;
    const centerY = this.position.y + this.size.y / 2;
    const weaponLength = 30;
    const weaponEndX = centerX + Math.cos(this.aimAngle) * weaponLength;
    const weaponEndY = centerY + Math.sin(this.aimAngle) * weaponLength;
    
    ctx.strokeStyle = '#333333';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(weaponEndX, weaponEndY);
    ctx.stroke();
    
    // Draw health bar above player
    this.drawHealthBar(ctx);
  }

  /**
   * Draw health bar above the player
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
   * Get current weapon
   */
  getCurrentWeapon(): WeaponDef | undefined {
    return this.weapons[this.currentWeaponIndex];
  }

  /**
   * Heal the player
   */
  heal(amount: number): void {
    this.health += amount;
    if (this.health > this.maxHealth) {
      this.health = this.maxHealth;
    }
  }
}
