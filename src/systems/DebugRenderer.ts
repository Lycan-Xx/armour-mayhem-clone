import { Entity } from '../entities/Entity';
import { PhysicsSystem } from './PhysicsSystem';

export class DebugRenderer {
  private enabled: boolean = false;

  toggle(): void {
    this.enabled = !this.enabled;
    console.log(`[Debug] Visualization ${this.enabled ? 'enabled' : 'disabled'}`);
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  renderEntityDebug(ctx: CanvasRenderingContext2D, entities: Entity[]): void {
    if (!this.enabled) return;

    for (const entity of entities) {
      if (!entity.active) continue;

      const bounds = entity.getBounds();

      ctx.save();

      ctx.strokeStyle = entity.hasTag('player') ? '#00FF00' :
                        entity.hasTag('enemy') ? '#FF0000' :
                        entity.hasTag('projectile') ? '#FFFF00' : '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);

      if (entity.hasTag('grounded')) {
        ctx.fillStyle = 'rgba(0, 255, 0, 0.3)';
        ctx.fillRect(bounds.x, bounds.y + bounds.height - 2, bounds.width, 2);
      }

      const centerX = bounds.x + bounds.width / 2;
      const centerY = bounds.y + bounds.height / 2;

      if (entity.velocity.x !== 0 || entity.velocity.y !== 0) {
        ctx.strokeStyle = '#FF00FF';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(centerX + entity.velocity.x * 0.1, centerY + entity.velocity.y * 0.1);
        ctx.stroke();
      }

      ctx.fillStyle = '#FFFFFF';
      ctx.font = '10px monospace';
      ctx.fillText(`ID:${entity.id}`, bounds.x, bounds.y - 5);

      const tags = Array.from(entity.tags).join(',');
      if (tags) {
        ctx.fillText(tags, bounds.x, bounds.y + bounds.height + 12);
      }

      ctx.restore();
    }
  }

  renderPhysicsDebug(ctx: CanvasRenderingContext2D, physicsSystem: PhysicsSystem): void {
    if (!this.enabled) return;

    const platforms = physicsSystem.getPlatforms();

    ctx.save();

    for (const platform of platforms) {
      if (platform.oneWay) {
        ctx.strokeStyle = '#00FFFF';
        ctx.lineWidth = 3;
        ctx.setLineDash([5, 5]);
      } else {
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.setLineDash([]);
      }

      ctx.strokeRect(platform.x, platform.y, platform.width, platform.height);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = '10px monospace';
      ctx.fillText(
        platform.oneWay ? 'ONE-WAY' : 'SOLID',
        platform.x + 5,
        platform.y + 15
      );
    }

    ctx.restore();
  }

  renderDebugInfo(ctx: CanvasRenderingContext2D, info: any): void {
    if (!this.enabled) return;

    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(10, 10, 250, 120);

    ctx.fillStyle = '#00FF00';
    ctx.font = '12px monospace';
    let y = 30;

    ctx.fillText(`FPS: ${info.fps || 0}`, 20, y);
    y += 20;
    ctx.fillText(`Entities: ${info.entityCount || 0}`, 20, y);
    y += 20;
    ctx.fillText(`Player Pos: (${Math.round(info.playerX || 0)}, ${Math.round(info.playerY || 0)})`, 20, y);
    y += 20;
    ctx.fillText(`Player Vel: (${(info.playerVelX || 0).toFixed(1)}, ${(info.playerVelY || 0).toFixed(1)})`, 20, y);
    y += 20;
    ctx.fillText(`Grounded: ${info.playerGrounded ? 'YES' : 'NO'}`, 20, y);
    y += 20;
    ctx.fillText(`Press G to toggle debug`, 20, y);

    ctx.restore();
  }
}
