/**
 * SoundManager handles audio playback using Web Audio API.
 * Supports loading, caching, and playing sound effects with volume control.
 */
export class SoundManager {
  private audioContext: AudioContext | null = null;
  private sounds: Map<string, AudioBuffer> = new Map();
  private masterVolume: number = 0.5;

  constructor() {
    // Initialize AudioContext lazily (requires user interaction)
    this.initAudioContext();
  }

  /**
   * Initialize the Web Audio API context
   */
  private initAudioContext(): void {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (e) {
      console.warn('Web Audio API not supported', e);
    }
  }

  /**
   * Resume audio context (required after user interaction)
   */
  async resumeContext(): Promise<void> {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
  }

  /**
   * Load a sound from a URL
   * @param name - Identifier for the sound
   * @param url - URL to the audio file
   */
  async loadSound(name: string, url: string): Promise<void> {
    if (!this.audioContext) return;

    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
      this.sounds.set(name, audioBuffer);
    } catch (e) {
      console.warn(`Failed to load sound: ${name}`, e);
    }
  }

  /**
   * Play a sound effect
   * @param name - Name of the sound to play
   * @param volume - Volume multiplier (0-1), defaults to 1
   */
  play(name: string, volume: number = 1.0): void {
    if (!this.audioContext) return;

    const buffer = this.sounds.get(name);
    if (!buffer) {
      console.warn(`Sound not found: ${name}`);
      return;
    }

    // Create source node
    const source = this.audioContext.createBufferSource();
    source.buffer = buffer;

    // Create gain node for volume control
    const gainNode = this.audioContext.createGain();
    gainNode.gain.value = volume * this.masterVolume;

    // Connect nodes: source -> gain -> destination
    source.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    // Play the sound
    source.start(0);
  }

  /**
   * Set master volume
   * @param volume - Volume level (0-1)
   */
  setMasterVolume(volume: number): void {
    this.masterVolume = Math.max(0, Math.min(1, volume));
  }

  /**
   * Get master volume
   */
  getMasterVolume(): number {
    return this.masterVolume;
  }

  /**
   * Check if a sound is loaded
   */
  isSoundLoaded(name: string): boolean {
    return this.sounds.has(name);
  }

  /**
   * Generate a simple beep sound (for testing without audio files)
   */
  playBeep(frequency: number = 440, duration: number = 0.1): void {
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(this.masterVolume * 0.3, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  /**
   * Create placeholder sounds using oscillators (for development)
   */
  createPlaceholderSounds(): void {
    // Since we don't have actual audio files, we'll use the beep method
    // This is just to register the sound names
    const soundNames = ['shoot', 'jump', 'hit', 'death'];
    soundNames.forEach(name => {
      // Mark as "loaded" even though we'll use beeps
      this.sounds.set(name, new AudioBuffer({ length: 1, sampleRate: 44100 }));
    });
  }

  /**
   * Play placeholder sound effects
   */
  playPlaceholder(name: string): void {
    switch (name) {
      case 'shoot':
        this.playBeep(800, 0.05);
        break;
      case 'jump':
        this.playBeep(400, 0.1);
        break;
      case 'hit':
        this.playBeep(200, 0.1);
        break;
      case 'death':
        this.playBeep(100, 0.3);
        break;
      default:
        this.playBeep(440, 0.1);
    }
  }
}
