import { Vec2 } from '../types/Vec2';

/**
 * InputManager handles all keyboard and mouse input for the game.
 * It tracks key states, mouse position, and mouse button states.
 */
export class InputManager {
  private keys: Map<string, boolean> = new Map();
  private mousePos: Vec2 = new Vec2(0, 0);
  private mouseButtons: Map<number, boolean> = new Map();
  private canvas: HTMLCanvasElement | null = null;

  /**
   * Initialize the InputManager and attach event listeners to the canvas
   */
  initialize(canvas: HTMLCanvasElement): void {
    this.canvas = canvas;
    this.attachEventListeners();
  }

  /**
   * Attach all necessary event listeners
   */
  private attachEventListeners(): void {
    if (!this.canvas) return;

    // Keyboard events
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);

    // Mouse events
    this.canvas.addEventListener('mousemove', this.handleMouseMove);
    this.canvas.addEventListener('mousedown', this.handleMouseDown);
    this.canvas.addEventListener('mouseup', this.handleMouseUp);

    // Prevent context menu on right-click
    this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  /**
   * Remove all event listeners (cleanup)
   */
  cleanup(): void {
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);

    if (this.canvas) {
      this.canvas.removeEventListener('mousemove', this.handleMouseMove);
      this.canvas.removeEventListener('mousedown', this.handleMouseDown);
      this.canvas.removeEventListener('mouseup', this.handleMouseUp);
    }

    this.keys.clear();
    this.mouseButtons.clear();
  }

  /**
   * Handle keydown events
   */
  private handleKeyDown = (event: KeyboardEvent): void => {
    this.keys.set(event.key.toLowerCase(), true);
    
    // Prevent default behavior for game keys
    if (['w', 'a', 's', 'd', ' ', 'f', 'escape'].includes(event.key.toLowerCase())) {
      event.preventDefault();
    }
  };

  /**
   * Handle keyup events
   */
  private handleKeyUp = (event: KeyboardEvent): void => {
    this.keys.set(event.key.toLowerCase(), false);
  };

  /**
   * Handle mouse move events and update mouse position relative to canvas
   */
  private handleMouseMove = (event: MouseEvent): void => {
    if (!this.canvas) return;

    const rect = this.canvas.getBoundingClientRect();
    this.mousePos.set(
      event.clientX - rect.left,
      event.clientY - rect.top
    );
  };

  /**
   * Handle mouse button down events
   */
  private handleMouseDown = (event: MouseEvent): void => {
    this.mouseButtons.set(event.button, true);
    event.preventDefault();
  };

  /**
   * Handle mouse button up events
   */
  private handleMouseUp = (event: MouseEvent): void => {
    this.mouseButtons.set(event.button, false);
  };

  /**
   * Check if a key is currently pressed
   * @param key - The key to check (case-insensitive)
   */
  isKeyDown(key: string): boolean {
    return this.keys.get(key.toLowerCase()) || false;
  }

  /**
   * Get the current mouse position relative to the canvas
   */
  getMousePosition(): Vec2 {
    return this.mousePos.clone();
  }

  /**
   * Check if a mouse button is currently pressed
   * @param button - The mouse button (0 = left, 1 = middle, 2 = right)
   */
  isMouseButtonDown(button: number): boolean {
    return this.mouseButtons.get(button) || false;
  }

  /**
   * Reset all input states (useful for pause/unpause)
   */
  reset(): void {
    this.keys.clear();
    this.mouseButtons.clear();
  }
}
