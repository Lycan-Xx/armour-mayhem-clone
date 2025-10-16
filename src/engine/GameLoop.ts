/**
 * GameLoop implements a fixed-timestep game loop with interpolated rendering.
 * Uses the accumulator pattern to ensure consistent physics updates at 60Hz
 * while allowing variable framerate rendering for smooth visuals.
 */
export class GameLoop {
  private readonly FIXED_TIMESTEP = 1 / 60; // 60 updates per second (16.67ms)
  private readonly MAX_FRAME_TIME = 0.25; // Cap at 250ms to prevent spiral of death
  
  private isRunning = false;
  private lastFrameTime = 0;
  private accumulator = 0;
  private animationFrameId: number | null = null;
  
  private updateCallback: (dt: number) => void;
  private renderCallback: (alpha: number) => void;

  /**
   * Create a new GameLoop
   * @param updateCallback - Function called for each fixed timestep update
   * @param renderCallback - Function called for each render frame with interpolation alpha
   */
  constructor(
    updateCallback: (dt: number) => void,
    renderCallback: (alpha: number) => void
  ) {
    this.updateCallback = updateCallback;
    this.renderCallback = renderCallback;
  }

  /**
   * Start the game loop
   */
  start(): void {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.lastFrameTime = performance.now() / 1000; // Convert to seconds
    this.accumulator = 0;
    this.loop();
  }

  /**
   * Stop the game loop
   */
  stop(): void {
    this.isRunning = false;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  /**
   * Main game loop using requestAnimationFrame
   */
  private loop = (): void => {
    if (!this.isRunning) return;

    const currentTime = performance.now() / 1000; // Convert to seconds
    let frameTime = currentTime - this.lastFrameTime;
    this.lastFrameTime = currentTime;

    // Cap frame time to prevent spiral of death
    // (when updates take longer than timestep)
    if (frameTime > this.MAX_FRAME_TIME) {
      frameTime = this.MAX_FRAME_TIME;
    }

    // Add frame time to accumulator
    this.accumulator += frameTime;

    // Process fixed timestep updates
    while (this.accumulator >= this.FIXED_TIMESTEP) {
      this.updateCallback(this.FIXED_TIMESTEP);
      this.accumulator -= this.FIXED_TIMESTEP;
    }

    // Calculate interpolation alpha for smooth rendering
    // Alpha represents how far between the previous and next update we are
    const alpha = this.accumulator / this.FIXED_TIMESTEP;

    // Render with interpolation
    this.renderCallback(alpha);

    // Schedule next frame
    this.animationFrameId = requestAnimationFrame(this.loop);
  };

  /**
   * Get the fixed timestep value (useful for external systems)
   */
  getFixedTimestep(): number {
    return this.FIXED_TIMESTEP;
  }

  /**
   * Check if the loop is currently running
   */
  getIsRunning(): boolean {
    return this.isRunning;
  }
}
