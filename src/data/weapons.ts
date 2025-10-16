import { WeaponDef } from '../types';

/**
 * Weapon definitions for all available weapons in the game
 */

export const WEAPON_PISTOL: WeaponDef = {
  name: 'Pistol',
  damage: 25,
  fireRate: 3, // 3 shots per second
  magazineSize: 12,
  reloadTime: 1.5, // 1.5 seconds
  projectileSpeed: 800, // pixels per second
  spread: 2, // degrees
  projectileCount: 1,
};

export const WEAPON_SHOTGUN: WeaponDef = {
  name: 'Shotgun',
  damage: 15, // per pellet
  fireRate: 1, // 1 shot per second
  magazineSize: 6,
  reloadTime: 2.5, // 2.5 seconds
  projectileSpeed: 600, // pixels per second
  spread: 15, // degrees (wide spread)
  projectileCount: 6, // 6 pellets per shot
};

export const WEAPON_RIFLE: WeaponDef = {
  name: 'Rifle',
  damage: 20,
  fireRate: 8, // 8 shots per second (automatic)
  magazineSize: 30,
  reloadTime: 2.0, // 2 seconds
  projectileSpeed: 1000, // pixels per second (fast)
  spread: 3, // degrees
  projectileCount: 1,
};

/**
 * Array of all available weapons
 */
export const ALL_WEAPONS: WeaponDef[] = [
  WEAPON_PISTOL,
  WEAPON_SHOTGUN,
  WEAPON_RIFLE,
];

/**
 * Get a weapon definition by name
 */
export function getWeaponByName(name: string): WeaponDef | undefined {
  return ALL_WEAPONS.find(weapon => weapon.name === name);
}
