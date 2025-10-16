import { SaveData } from '../types';

/**
 * StorageManager handles game progress persistence using localStorage.
 */
export class StorageManager {
  private readonly STORAGE_KEY = 'armor_mayhem_save';

  /**
   * Save progress to localStorage
   */
  saveProgress(data: SaveData): void {
    try {
      const json = JSON.stringify(data);
      localStorage.setItem(this.STORAGE_KEY, json);
    } catch (e) {
      console.warn('Failed to save progress', e);
    }
  }

  /**
   * Load progress from localStorage
   */
  loadProgress(): SaveData | null {
    try {
      const json = localStorage.getItem(this.STORAGE_KEY);
      if (!json) return null;
      return JSON.parse(json) as SaveData;
    } catch (e) {
      console.warn('Failed to load progress', e);
      return null;
    }
  }

  /**
   * Update best score for a level
   */
  updateBestScore(level: number, score: number): void {
    const data = this.loadProgress() || { unlockedLevels: [0], bestScores: {} };
    
    if (!data.bestScores[level] || score > data.bestScores[level]) {
      data.bestScores[level] = score;
      this.saveProgress(data);
    }
  }

  /**
   * Unlock a level
   */
  unlockLevel(level: number): void {
    const data = this.loadProgress() || { unlockedLevels: [0], bestScores: {} };
    
    if (!data.unlockedLevels.includes(level)) {
      data.unlockedLevels.push(level);
      data.unlockedLevels.sort((a, b) => a - b);
      this.saveProgress(data);
    }
  }

  /**
   * Check if a level is unlocked
   */
  isLevelUnlocked(level: number): boolean {
    const data = this.loadProgress();
    if (!data) return level === 0; // First level always unlocked
    return data.unlockedLevels.includes(level);
  }

  /**
   * Get best score for a level
   */
  getBestScore(level: number): number {
    const data = this.loadProgress();
    return data?.bestScores[level] || 0;
  }

  /**
   * Clear all saved data
   */
  clearProgress(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}
