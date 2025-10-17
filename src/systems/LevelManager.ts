import { Level } from '../types';
import { Vec2 } from '../types/Vec2';
import { Player } from '../entities/Player';
import { Enemy } from '../entities/Enemy';
import { Engine } from '../engine/Engine';
import { PhysicsSystem } from './PhysicsSystem';
import { WeaponSystem } from './WeaponSystem';
import { InputManager } from '../engine/InputManager';
import { WEAPON_PISTOL } from '../data/weapons';
import { ALL_WEAPONS } from '../data/weapons';

/**
 * LevelManager handles level loading, entity spawning, and level transitions.
 */
export class LevelManager {
  private currentLevel: Level | null = null;
  private currentLevelIndex: number = 0;
  private engine: Engine;
  private physicsSystem: PhysicsSystem;
  private weaponSystem: WeaponSystem;
  private inputManager: InputManager;
  private player: Player | null = null;
  private enemies: Enemy[] = [];
  private onLevelComplete?: () => void;
  private onPlayerDeath?: () => void;

  constructor(
    engine: Engine,
    physicsSystem: PhysicsSystem,
    weaponSystem: WeaponSystem,
    inputManager: InputManager
  ) {
    this.engine = engine;
    this.physicsSystem = physicsSystem;
    this.weaponSystem = weaponSystem;
    this.inputManager = inputManager;
  }

  /**
   * Load a level by index
   */
  loadLevel(level: Level, levelIndex: number): void {
    // Clear previous level
    this.unloadLevel();

    this.currentLevel = level;
    this.currentLevelIndex = levelIndex;

    // Set up platforms in physics system
    this.physicsSystem.setPlatforms(level.platforms);

    // Spawn player
    this.spawnPlayer(new Vec2(level.playerSpawn.x, level.playerSpawn.y));

    // Spawn enemies
    this.spawnEnemies(level.enemySpawns);
  }

  /**
   * Unload current level and clean up entities
   */
  unloadLevel(): void {
    // Clear all entities
    this.engine.clear();
    
    // Clear physics platforms
    this.physicsSystem.clearPlatforms();
    
    // Clear references
    this.player = null;
    this.enemies = [];
    this.currentLevel = null;
  }

  /**
   * Spawn the player at a position
   */
  private spawnPlayer(position: Vec2): void {
    this.player = new Player(
      0, // ID will be assigned by engine
      position,
      this.inputManager,
      this.weaponSystem,
      ALL_WEAPONS // Give player all weapons
    );
    
    // Set camera for world coordinate conversion
    this.player.setCamera(this.engine.camera);
    
    // Set shoot callback to spawn projectiles
    this.player.setOnShootCallback((projectiles) => {
      for (const proj of projectiles) {
        this.engine.spawnProjectile({ ...proj, owner: this.player!.id });
      }
    });
    
    // Spawn assigns the real ID
    this.engine.spawn(this.player);
    
    // Re-register weapon with the real ID after spawn
    if (this.player.weapons.length > 0 && this.player.weapons[0]) {
      this.weaponSystem.registerWeapon(this.player.id, this.player.weapons[0]);
    }
  }

  /**
   * Spawn enemies from spawn data
   */
  private spawnEnemies(spawns: any[]): void {
    for (const spawn of spawns) {
      const enemy = new Enemy(
        0, // ID will be assigned by engine
        new Vec2(spawn.x, spawn.y),
        this.weaponSystem,
        WEAPON_PISTOL, // Enemies use pistol
        spawn.patrolPoints?.map((p: any) => new Vec2(p.x, p.y)) || []
      );
      
      // Set shoot callback to spawn projectiles
      enemy.setOnShootCallback((projectiles) => {
        for (const proj of projectiles) {
          this.engine.spawnProjectile({ ...proj, owner: enemy.id });
        }
      });
      
      this.enemies.push(enemy);
      
      // Spawn assigns the real ID
      this.engine.spawn(enemy);
      
      // Re-register weapon with the real ID after spawn
      this.weaponSystem.registerWeapon(enemy.id, WEAPON_PISTOL);
    }
  }

  /**
   * Respawn the player at the spawn point
   */
  respawnPlayer(): void {
    if (!this.currentLevel) return;

    // Remove old player if exists
    if (this.player) {
      this.engine.despawn(this.player.id);
    }

    // Spawn new player
    this.spawnPlayer(new Vec2(
      this.currentLevel.playerSpawn.x,
      this.currentLevel.playerSpawn.y
    ));
  }

  /**
   * Update level state (check win/lose conditions)
   */
  update(dt: number): void {
    // Update enemy AI
    if (this.player && this.player.active) {
      for (const enemy of this.enemies) {
        if (enemy.active) {
          enemy.updateAI(dt, this.player);
        }
      }
    }

    // Check if player died
    if (this.player && !this.player.active) {
      if (this.onPlayerDeath) {
        this.onPlayerDeath();
      }
    }

    // Check if all enemies are dead (level complete)
    const allEnemiesDead = this.enemies.every(enemy => !enemy.active);
    if (allEnemiesDead && this.enemies.length > 0) {
      if (this.onLevelComplete) {
        this.onLevelComplete();
      }
    }
  }

  /**
   * Get the current player
   */
  getPlayer(): Player | null {
    return this.player;
  }

  /**
   * Get all enemies
   */
  getEnemies(): Enemy[] {
    return this.enemies;
  }

  /**
   * Get current level
   */
  getCurrentLevel(): Level | null {
    return this.currentLevel;
  }

  /**
   * Get current level index
   */
  getCurrentLevelIndex(): number {
    return this.currentLevelIndex;
  }

  /**
   * Set level complete callback
   */
  setOnLevelComplete(callback: () => void): void {
    this.onLevelComplete = callback;
  }

  /**
   * Set player death callback
   */
  setOnPlayerDeath(callback: () => void): void {
    this.onPlayerDeath = callback;
  }

  /**
   * Check if level is complete
   */
  isLevelComplete(): boolean {
    return this.enemies.every(enemy => !enemy.active) && this.enemies.length > 0;
  }

  /**
   * Get remaining enemy count
   */
  getRemainingEnemyCount(): number {
    return this.enemies.filter(enemy => enemy.active).length;
  }
}
