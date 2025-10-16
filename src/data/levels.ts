import { Level } from '../types';

/**
 * Level 1: Tutorial/Easy level with basic platforms and few enemies
 */
export const LEVEL_1: Level = {
  name: 'Warehouse District',
  bounds: { width: 1600, height: 900 },
  playerSpawn: { x: 100, y: 700 },
  platforms: [
    // Ground
    { x: 0, y: 800, width: 1600, height: 100, oneWay: false },
    
    // Lower platforms
    { x: 300, y: 650, width: 200, height: 20, oneWay: true },
    { x: 700, y: 650, width: 200, height: 20, oneWay: true },
    { x: 1100, y: 650, width: 200, height: 20, oneWay: true },
    
    // Mid platforms
    { x: 150, y: 500, width: 150, height: 20, oneWay: true },
    { x: 500, y: 500, width: 200, height: 20, oneWay: true },
    { x: 900, y: 500, width: 200, height: 20, oneWay: true },
    { x: 1300, y: 500, width: 150, height: 20, oneWay: true },
    
    // High platforms
    { x: 400, y: 350, width: 150, height: 20, oneWay: true },
    { x: 800, y: 300, width: 200, height: 20, oneWay: true },
    { x: 1200, y: 350, width: 150, height: 20, oneWay: true },
    
    // Walls
    { x: 0, y: 0, width: 20, height: 800, oneWay: false },
    { x: 1580, y: 0, width: 20, height: 800, oneWay: false },
  ],
  enemySpawns: [
    {
      x: 800,
      y: 750,
      type: 'basic',
      patrolPoints: [
        { x: 600, y: 750 },
        { x: 1000, y: 750 },
      ],
    },
    {
      x: 500,
      y: 450,
      type: 'basic',
      patrolPoints: [
        { x: 500, y: 450 },
        { x: 700, y: 450 },
      ],
    },
    {
      x: 1300,
      y: 450,
      type: 'basic',
      patrolPoints: [
        { x: 1100, y: 450 },
        { x: 1400, y: 450 },
      ],
    },
  ],
};

/**
 * Level 2: Medium difficulty with more complex layout
 */
export const LEVEL_2: Level = {
  name: 'Industrial Complex',
  bounds: { width: 2000, height: 900 },
  playerSpawn: { x: 100, y: 700 },
  platforms: [
    // Ground with gaps
    { x: 0, y: 800, width: 600, height: 100, oneWay: false },
    { x: 800, y: 800, width: 400, height: 100, oneWay: false },
    { x: 1400, y: 800, width: 600, height: 100, oneWay: false },
    
    // Lower platforms
    { x: 200, y: 650, width: 150, height: 20, oneWay: true },
    { x: 450, y: 650, width: 150, height: 20, oneWay: true },
    { x: 900, y: 650, width: 200, height: 20, oneWay: true },
    { x: 1250, y: 650, width: 150, height: 20, oneWay: true },
    { x: 1600, y: 650, width: 150, height: 20, oneWay: true },
    
    // Mid platforms
    { x: 100, y: 500, width: 200, height: 20, oneWay: true },
    { x: 400, y: 450, width: 150, height: 20, oneWay: true },
    { x: 700, y: 500, width: 250, height: 20, oneWay: true },
    { x: 1100, y: 450, width: 150, height: 20, oneWay: true },
    { x: 1400, y: 500, width: 200, height: 20, oneWay: true },
    { x: 1750, y: 500, width: 150, height: 20, oneWay: true },
    
    // High platforms
    { x: 250, y: 350, width: 150, height: 20, oneWay: true },
    { x: 600, y: 300, width: 200, height: 20, oneWay: true },
    { x: 1000, y: 300, width: 200, height: 20, oneWay: true },
    { x: 1400, y: 350, width: 150, height: 20, oneWay: true },
    { x: 1700, y: 300, width: 150, height: 20, oneWay: true },
    
    // Walls
    { x: 0, y: 0, width: 20, height: 800, oneWay: false },
    { x: 1980, y: 0, width: 20, height: 800, oneWay: false },
  ],
  enemySpawns: [
    {
      x: 400,
      y: 750,
      type: 'basic',
      patrolPoints: [
        { x: 200, y: 750 },
        { x: 500, y: 750 },
      ],
    },
    {
      x: 1000,
      y: 750,
      type: 'basic',
      patrolPoints: [
        { x: 900, y: 750 },
        { x: 1100, y: 750 },
      ],
    },
    {
      x: 1700,
      y: 750,
      type: 'basic',
      patrolPoints: [
        { x: 1500, y: 750 },
        { x: 1900, y: 750 },
      ],
    },
    {
      x: 700,
      y: 450,
      type: 'basic',
      patrolPoints: [
        { x: 700, y: 450 },
        { x: 950, y: 450 },
      ],
    },
    {
      x: 1500,
      y: 450,
      type: 'basic',
      patrolPoints: [
        { x: 1400, y: 450 },
        { x: 1600, y: 450 },
      ],
    },
  ],
};

/**
 * Level 3: Hard difficulty with vertical layout and many enemies
 */
export const LEVEL_3: Level = {
  name: 'Tower Assault',
  bounds: { width: 1400, height: 1200 },
  playerSpawn: { x: 100, y: 1050 },
  platforms: [
    // Ground
    { x: 0, y: 1100, width: 1400, height: 100, oneWay: false },
    
    // Floor 1
    { x: 100, y: 950, width: 300, height: 20, oneWay: true },
    { x: 600, y: 950, width: 300, height: 20, oneWay: true },
    { x: 1000, y: 950, width: 300, height: 20, oneWay: true },
    
    // Floor 2
    { x: 200, y: 800, width: 250, height: 20, oneWay: true },
    { x: 650, y: 800, width: 300, height: 20, oneWay: true },
    { x: 1100, y: 800, width: 200, height: 20, oneWay: true },
    
    // Floor 3
    { x: 100, y: 650, width: 300, height: 20, oneWay: true },
    { x: 550, y: 650, width: 300, height: 20, oneWay: true },
    { x: 1000, y: 650, width: 300, height: 20, oneWay: true },
    
    // Floor 4
    { x: 250, y: 500, width: 200, height: 20, oneWay: true },
    { x: 600, y: 500, width: 200, height: 20, oneWay: true },
    { x: 950, y: 500, width: 200, height: 20, oneWay: true },
    
    // Floor 5
    { x: 150, y: 350, width: 250, height: 20, oneWay: true },
    { x: 550, y: 350, width: 300, height: 20, oneWay: true },
    { x: 1000, y: 350, width: 250, height: 20, oneWay: true },
    
    // Top floor
    { x: 400, y: 200, width: 600, height: 20, oneWay: true },
    
    // Walls
    { x: 0, y: 0, width: 20, height: 1100, oneWay: false },
    { x: 1380, y: 0, width: 20, height: 1100, oneWay: false },
  ],
  enemySpawns: [
    // Ground floor
    {
      x: 700,
      y: 1050,
      type: 'basic',
      patrolPoints: [
        { x: 500, y: 1050 },
        { x: 900, y: 1050 },
      ],
    },
    // Floor 1
    {
      x: 250,
      y: 900,
      type: 'basic',
      patrolPoints: [
        { x: 150, y: 900 },
        { x: 350, y: 900 },
      ],
    },
    {
      x: 1150,
      y: 900,
      type: 'basic',
      patrolPoints: [
        { x: 1050, y: 900 },
        { x: 1250, y: 900 },
      ],
    },
    // Floor 2
    {
      x: 800,
      y: 750,
      type: 'basic',
      patrolPoints: [
        { x: 700, y: 750 },
        { x: 900, y: 750 },
      ],
    },
    // Floor 3
    {
      x: 250,
      y: 600,
      type: 'basic',
      patrolPoints: [
        { x: 150, y: 600 },
        { x: 350, y: 600 },
      ],
    },
    {
      x: 1150,
      y: 600,
      type: 'basic',
      patrolPoints: [
        { x: 1050, y: 600 },
        { x: 1250, y: 600 },
      ],
    },
    // Floor 4
    {
      x: 700,
      y: 450,
      type: 'basic',
      patrolPoints: [
        { x: 650, y: 450 },
        { x: 750, y: 450 },
      ],
    },
    // Floor 5
    {
      x: 700,
      y: 300,
      type: 'basic',
      patrolPoints: [
        { x: 600, y: 300 },
        { x: 800, y: 300 },
      ],
    },
  ],
};

/**
 * Array of all levels
 */
export const ALL_LEVELS: Level[] = [LEVEL_1, LEVEL_2, LEVEL_3];

/**
 * Get a level by index
 */
export function getLevel(index: number): Level | undefined {
  return ALL_LEVELS[index];
}

/**
 * Get total number of levels
 */
export function getLevelCount(): number {
  return ALL_LEVELS.length;
}
