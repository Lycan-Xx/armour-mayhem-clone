import { Entity } from '../entities/Entity';
import { Projectile } from '../entities/Projectile';
import { EntityID, GameState } from '../types';
import { PhysicsSystem } from '../systems/PhysicsSystem';
import { CollisionSystem } from '../systems/CollisionSystem';
import { WeaponSystem } from '../systems/WeaponSystem';
import { ParticleSystem } from '../systems/ParticleSystem';
import { ProjectilePool } from '../systems/ProjectilePool';
import { SoundManager } from '../systems/SoundManager';
import { Camera } from './Camera';
import { InputManager } from './InputManager';

/**
 * Engine is the central coordinator for all game systems and entities.
 * It manages the entity registry, system updates, and rendering.
 */
export class Engine {
  private entities: Map<EntityID, Entity> = new Map();
  private nextEntityId: EntityID = 1;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  
  // Systems
  public physicsSystem: PhysicsSystem;
  public collisionSystem: CollisionSystem;
  public weaponSystem: WeaponSystem;
  public particleSystem: ParticleSystem;
  public projectilePool: ProjectilePool;
  public soundManager: SoundManager;
  public camera: Camera;
  public inputManager: InputManager;
  
  // Game state
  private gameState: GameState = GameState.PLAYING;
  private isPaused: boolean = false;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Failed to get 2D rendering context');
    }
    this.ctx = ctx;
    
    // Initialize systems
    this.physicsSystem = new PhysicsSystem();
    this.collisionSystem = new CollisionSystem();
    this.weaponSystem = new WeaponSystem();
    this.particleSystem = new ParticleSystem();
    this.projectilePool = new ProjectilePool();
    this.soundManager = new SoundManager();
    this.camera = new Camera(canvas.width, canvas.height);
    this.inputManager = new InputManager();
    
    // Initialize input manager
    this.inputManager.initialize(canvas);
    
    // Set up collision callbacks
    this.setupCollisionCallbacks();
    
    // Create placeholder sounds
    this.soundManager.createPlaceholderSounds();
  }

  /**
   * Spawn a new entity and add it to the registry
   * @param entity - The entity to spawn
   * @returns The unique ID assigned to the entity
   */
  spawn(entity: Entity): EntityID {
    const id = this.nextEntityId++;
    entity.id = id;
    this.entities.set(id, entity);
    return id;
  }

  /**
   * Remove an entity from the registry
   * @param id - The ID of the entity to despawn
   */
  despawn(id: EntityID): void {
    this.entities.delete(id);
  }

  /**
   * Get an entity by its ID
   * @param id - The entity ID to look up
   * @returns The entity, or undefined if not found
   */
  getEntity(id: EntityID): Entity | undefined {
    return this.entities.get(id);
  }

  /**
   * Query entities that match a predicate function
   * @param predicate - Function that returns true for entities to include
   * @returns Array of matching entities
   */
  queryEntities(predicate: (entity: Entity) => boolean): Entity[] {
    const results: Entity[] = [];
    for (const entity of this.entities.values()) {
      if (entity.active && predicate(entity)) {
        results.push(entity);
      }
    }
    return results;
  }

  /**
   * Get all active entities
   * @returns Array of all active entities
   */
  getAllEntities(): Entity[] {
    return Array.from(this.entities.values()).filter(e => e.active);
  }

  /**
   * Set up collision callbacks between different entity types
   */
  private setupCollisionCallbacks(): void {
    // Projectile hits player
    this.collisionSystem.onCollision('projectile', 'player', (projectile, player) => {
      const proj = projectile as Projectile;
      // Only apply damage if player is a Player instance and has takeDamage
      if (proj.owner !== player.id && typeof player.takeDamage === 'function') {
        player.takeDamage(proj.damage);
        proj.deactivate();
        this.particleSystem.spawnHitSparks(proj.position, proj.velocity.normalize());
        this.soundManager.playPlaceholder('hit');
      }
    });

    // Projectile hits enemy
    this.collisionSystem.onCollision('projectile', 'enemy', (projectile, enemy) => {
      const proj = projectile as Projectile;
      // Only apply damage if enemy is an Enemy instance and has takeDamage
      if (proj.owner !== enemy.id && typeof enemy.takeDamage === 'function') {
        enemy.takeDamage(proj.damage);
        proj.deactivate();
        this.particleSystem.spawnHitSparks(proj.position, proj.velocity.normalize());
        this.soundManager.playPlaceholder('hit');
      }
    });
  }

  /**
   * Update all entities and systems for one fixed timestep
   * @param dt - Delta time in seconds (fixed timestep)
   */
  update(dt: number): void {
    // Handle pause input (check before paused state so we can unpause)
    if (this.inputManager.isKeyPressed('escape')) {
      this.togglePause();
    }
    
    if (this.isPaused) {
      // Update input states even when paused
      this.inputManager.updateKeyStates();
      return;
    }
    
    // Update all active entities
    for (const entity of this.entities.values()) {
      if (entity.active) {
        entity.update(dt);
      }
    }
    
    // Update systems
    const activeEntities = this.getAllEntities();
    this.physicsSystem.update(activeEntities, dt);
    this.weaponSystem.update(dt);
    this.particleSystem.update(dt);
    this.projectilePool.update();
    
    // Handle weapon firing and projectile spawning
    this.handleProjectileSpawning();
    
    // Collision detection
    this.collisionSystem.detectCollisions(activeEntities);

    // Remove inactive entities (cleanup)
    for (const [id, entity] of this.entities.entries()) {
      if (!entity.active) {
        this.entities.delete(id);
      }
    }
    
    // Update input key states for next frame
    this.inputManager.updateKeyStates();
  }
  
  /**
   * Handle projectile spawning from weapon system
   */
  private handleProjectileSpawning(): void {
    // This will be called by entities when they fire
    // For now, projectiles are spawned directly by entities
  }

  /**
   * Render all entities to the canvas
   * @param _alpha - Interpolation alpha for smooth rendering (0-1) - reserved for future use
   */
  render(_alpha: number): void {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Apply camera transformation
    this.ctx.save();
    this.camera.applyTransform(this.ctx);

    // Render platforms
    this.renderPlatforms();

    // Render all active entities (with culling)
    for (const entity of this.entities.values()) {
      if (entity.active) {
        // Simple culling: only render if roughly on screen
        if (this.camera.isVisible(entity.position, 100)) {
          entity.render(this.ctx);
        }
      }
    }
    
    // Render particles
    this.particleSystem.render(this.ctx);
    
    // Reset camera transformation
    this.ctx.restore();
  }

  /**
   * Render all platforms
   */
  private renderPlatforms(): void {
    const platforms = this.physicsSystem.getPlatforms();
    
    for (const platform of platforms) {
      // Different colors for one-way vs solid platforms
      if (platform.oneWay) {
        this.ctx.fillStyle = '#3A3A5A'; // Darker purple for one-way platforms
        this.ctx.strokeStyle = '#5A5A8A'; // Lighter purple border
      } else {
        this.ctx.fillStyle = '#2A2A4A'; // Dark blue for solid platforms
        this.ctx.strokeStyle = '#4A4A6A'; // Lighter blue border
      }
      
      // Draw platform
      this.ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
      this.ctx.strokeRect(platform.x, platform.y, platform.width, platform.height);
      
      // Add a subtle gradient effect for one-way platforms to show direction
      if (platform.oneWay) {
        this.ctx.fillStyle = 'rgba(90, 90, 138, 0.3)';
        this.ctx.fillRect(platform.x, platform.y, platform.width, 3);
      }
    }
  }

  /**
   * Get the canvas element
   */
  getCanvas(): HTMLCanvasElement {
    return this.canvas;
  }

  /**
   * Get the rendering context
   */
  getContext(): CanvasRenderingContext2D {
    return this.ctx;
  }

  /**
   * Clear all entities from the engine
   */
  clear(): void {
    this.entities.clear();
  }

  /**
   * Get the total number of entities
   */
  getEntityCount(): number {
    return this.entities.size;
  }
  
  /**
   * Spawn a projectile from the pool
   */
  spawnProjectile(projectileData: any): void {
    const projectile = this.projectilePool.acquire(
      projectileData.position,
      projectileData.direction,
      projectileData.owner || 0,
      projectileData.damage,
      projectileData.speed
    );
    
    if (projectile) {
      this.spawn(projectile);
      this.particleSystem.spawnMuzzleFlash(projectileData.position, projectileData.direction);
      this.soundManager.playPlaceholder('shoot');
    }
  }
  
  /**
   * Toggle pause state
   */
  togglePause(): void {
    this.isPaused = !this.isPaused;
  }
  
  /**
   * Set pause state
   */
  setPaused(paused: boolean): void {
    this.isPaused = paused;
  }
  
  /**
   * Check if game is paused
   */
  isPausedState(): boolean {
    return this.isPaused;
  }
  
  /**
   * Set game state
   */
  setGameState(state: GameState): void {
    this.gameState = state;
  }
  
  /**
   * Get game state
   */
  getGameState(): GameState {
    return this.gameState;
  }
  
  /**
   * Cleanup and destroy engine
   */
  destroy(): void {
    this.inputManager.cleanup();
    this.clear();
  }
}
