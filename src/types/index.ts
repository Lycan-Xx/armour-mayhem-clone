/**
 * Core type definitions for the game engine
 */

// Unique identifier for entities
export type EntityID = number;

// Game state enum
export enum GameState {
  MENU = 'menu',
  PLAYING = 'playing',
  PAUSED = 'paused',
  GAME_OVER = 'gameOver',
  LEVEL_COMPLETE = 'levelComplete',
}

// AI state for enemies
export enum AIState {
  IDLE = 'idle',
  PATROL = 'patrol',
  CHASE = 'chase',
  ATTACK = 'attack',
}

// Weapon definition interface
export interface WeaponDef {
  name: string;
  damage: number;
  fireRate: number; // shots per second
  magazineSize: number;
  reloadTime: number; // seconds
  projectileSpeed: number;
  spread: number; // degrees
  projectileCount: number; // for shotgun
}

// Level data structure
export interface Level {
  name: string;
  platforms: PlatformData[];
  enemySpawns: EnemySpawnData[];
  playerSpawn: { x: number; y: number };
  bounds: { width: number; height: number };
}

// Platform data
export interface PlatformData {
  x: number;
  y: number;
  width: number;
  height: number;
  oneWay?: boolean;
}

// Enemy spawn data
export interface EnemySpawnData {
  x: number;
  y: number;
  type: string;
  patrolPoints?: { x: number; y: number }[];
}

// Save data structure
export interface SaveData {
  unlockedLevels: number[];
  bestScores: Record<number, number>;
}

// Re-export Vec2 and Rect
export { Vec2 } from './Vec2';
export { Rect } from './Rect';
