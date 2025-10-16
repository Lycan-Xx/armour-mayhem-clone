import { Entity } from '../entities/Entity';
import { EntityID } from '../types';

/**
 * Engine is the central coordinator for all game systems and entities.
 * It manages the entity registry, system updates, and rendering.
 */
export class Engine {
  private entities: Map<EntityID, Entity> = new Map();
  private nextEntityId: EntityID = 1;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Failed to get 2D rendering context');
    }
    this.ctx = ctx;
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
   * Update all entities and systems for one fixed timestep
   * @param dt - Delta time in seconds (fixed timestep)
   */
  update(dt: number): void {
    // Update all active entities
    for (const entity of this.entities.values()) {
      if (entity.active) {
        entity.update(dt);
      }
    }

    // Remove inactive entities (cleanup)
    for (const [id, entity] of this.entities.entries()) {
      if (!entity.active) {
        this.entities.delete(id);
      }
    }
  }

  /**
   * Render all entities to the canvas
   * @param alpha - Interpolation alpha for smooth rendering (0-1)
   */
  render(alpha: number): void {
    // Alpha will be used for position interpolation in future updates
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Render all active entities
    for (const entity of this.entities.values()) {
      if (entity.active) {
        entity.render(this.ctx);
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
}
