import { WeaponDef } from '../types';
import { Vec2 } from '../types/Vec2';

/**
 * Weapon state for tracking ammo, cooldown, and reload
 */
export interface WeaponState {
  weapon: WeaponDef;
  currentAmmo: number;
  isReloading: boolean;
  reloadTimer: number;
  fireCooldown: number;
}

/**
 * Projectile spawn data returned by fire() method
 */
export interface ProjectileSpawnData {
  position: Vec2;
  direction: Vec2;
  damage: number;
  speed: number;
}

/**
 * WeaponSystem manages weapon mechanics including firing, reloading, and ammo tracking.
 */
export class WeaponSystem {
  private weaponStates: Map<number, WeaponState> = new Map();

  /**
   * Register a weapon for an entity
   * @param entityId - The entity ID that owns this weapon
   * @param weapon - The weapon definition
   */
  registerWeapon(entityId: number, weapon: WeaponDef): void {
    this.weaponStates.set(entityId, {
      weapon,
      currentAmmo: weapon.magazineSize,
      isReloading: false,
      reloadTimer: 0,
      fireCooldown: 0,
    });
  }

  /**
   * Update all weapon states (cooldowns and reload timers)
   * @param dt - Delta time in seconds
   */
  update(dt: number): void {
    for (const state of this.weaponStates.values()) {
      // Update fire cooldown
      if (state.fireCooldown > 0) {
        state.fireCooldown -= dt;
        if (state.fireCooldown < 0) state.fireCooldown = 0;
      }

      // Update reload timer
      if (state.isReloading) {
        state.reloadTimer -= dt;
        if (state.reloadTimer <= 0) {
          // Reload complete
          state.isReloading = false;
          state.currentAmmo = state.weapon.magazineSize;
          state.reloadTimer = 0;
        }
      }
    }
  }

  /**
   * Attempt to fire a weapon
   * @param entityId - The entity ID firing the weapon
   * @param position - The position to spawn projectiles from
   * @param direction - The direction to fire (normalized)
   * @returns Array of projectile spawn data, or empty array if can't fire
   */
  fire(
    entityId: number,
    position: Vec2,
    direction: Vec2
  ): ProjectileSpawnData[] {
    const state = this.weaponStates.get(entityId);
    if (!state) return [];

    // Check if can fire
    if (state.isReloading || state.fireCooldown > 0 || state.currentAmmo <= 0) {
      return [];
    }

    // Consume ammo
    state.currentAmmo--;

    // Set fire cooldown
    state.fireCooldown = 1 / state.weapon.fireRate;

    // Auto-reload if magazine empty
    if (state.currentAmmo === 0) {
      this.startReload(entityId);
    }

    // Generate projectiles based on weapon
    const projectiles: ProjectileSpawnData[] = [];
    const weapon = state.weapon;

    for (let i = 0; i < weapon.projectileCount; i++) {
      // Calculate spread angle
      let spreadAngle = 0;
      if (weapon.projectileCount > 1) {
        // Distribute pellets evenly across spread
        const spreadRange = weapon.spread * (Math.PI / 180); // Convert to radians
        spreadAngle = (i / (weapon.projectileCount - 1) - 0.5) * spreadRange;
      } else {
        // Single projectile with random spread
        const spreadRange = weapon.spread * (Math.PI / 180);
        spreadAngle = (Math.random() - 0.5) * spreadRange;
      }

      // Calculate projectile direction with spread
      const angle = Math.atan2(direction.y, direction.x) + spreadAngle;
      const projectileDir = new Vec2(Math.cos(angle), Math.sin(angle));

      projectiles.push({
        position: position.clone(),
        direction: projectileDir,
        damage: weapon.damage,
        speed: weapon.projectileSpeed,
      });
    }

    return projectiles;
  }

  /**
   * Start reloading a weapon
   * @param entityId - The entity ID reloading
   * @returns True if reload started, false if already reloading or magazine full
   */
  startReload(entityId: number): boolean {
    const state = this.weaponStates.get(entityId);
    if (!state) return false;

    // Can't reload if already reloading or magazine is full
    if (state.isReloading || state.currentAmmo === state.weapon.magazineSize) {
      return false;
    }

    state.isReloading = true;
    state.reloadTimer = state.weapon.reloadTime;
    return true;
  }

  /**
   * Switch weapon for an entity
   * @param entityId - The entity ID
   * @param newWeapon - The new weapon definition
   */
  switchWeapon(entityId: number, newWeapon: WeaponDef): void {
    // Replace weapon state (cancels any ongoing reload)
    this.weaponStates.set(entityId, {
      weapon: newWeapon,
      currentAmmo: newWeapon.magazineSize,
      isReloading: false,
      reloadTimer: 0,
      fireCooldown: 0,
    });
  }

  /**
   * Get weapon state for an entity
   * @param entityId - The entity ID
   */
  getWeaponState(entityId: number): WeaponState | undefined {
    return this.weaponStates.get(entityId);
  }

  /**
   * Check if weapon can fire
   * @param entityId - The entity ID
   */
  canFire(entityId: number): boolean {
    const state = this.weaponStates.get(entityId);
    if (!state) return false;
    return !state.isReloading && state.fireCooldown <= 0 && state.currentAmmo > 0;
  }

  /**
   * Remove weapon state for an entity
   * @param entityId - The entity ID
   */
  unregisterWeapon(entityId: number): void {
    this.weaponStates.delete(entityId);
  }

  /**
   * Clear all weapon states
   */
  clear(): void {
    this.weaponStates.clear();
  }
}
