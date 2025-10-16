import { useEffect, useRef } from 'react';
import { Engine } from '../engine/Engine';
import { GameLoop } from '../engine/GameLoop';
import { LevelManager } from '../systems/LevelManager';
import { getLevel } from '../data/levels';

interface GameCanvasProps {
  onGameOver?: () => void;
  onLevelComplete?: () => void;
  currentLevel?: number;
}

export function GameCanvas({ onGameOver, onLevelComplete, currentLevel = 0 }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Engine | null>(null);
  const gameLoopRef = useRef<GameLoop | null>(null);
  const levelManagerRef = useRef<LevelManager | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas size
    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(dpr, dpr);
      }
      
      // Update camera viewport if engine exists
      if (engineRef.current) {
        engineRef.current.camera.setViewportSize(rect.width, rect.height);
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize engine
    const engine = new Engine(canvas);
    engineRef.current = engine;

    // Initialize level manager
    const levelManager = new LevelManager(
      engine,
      engine.physicsSystem,
      engine.weaponSystem,
      engine.inputManager
    );
    levelManagerRef.current = levelManager;

    // Set up callbacks
    levelManager.setOnLevelComplete(() => {
      if (onLevelComplete) {
        onLevelComplete();
      }
    });

    levelManager.setOnPlayerDeath(() => {
      if (onGameOver) {
        onGameOver();
      }
    });

    // Load initial level
    const level = getLevel(currentLevel);
    if (level) {
      levelManager.loadLevel(level, currentLevel);
      
      // Set camera bounds
      engine.camera.setBounds(level.bounds.width, level.bounds.height);
      
      // Center camera on player spawn
      engine.camera.centerOn({ x: level.playerSpawn.x, y: level.playerSpawn.y } as any);
    }

    // Resume audio context on first user interaction
    const resumeAudio = () => {
      engine.soundManager.resumeContext();
      document.removeEventListener('click', resumeAudio);
      document.removeEventListener('keydown', resumeAudio);
    };
    document.addEventListener('click', resumeAudio);
    document.addEventListener('keydown', resumeAudio);

    // Create game loop
    const gameLoop = new GameLoop(
      (dt: number) => {
        // Update
        engine.update(dt);
        levelManager.update(dt);
        
        // Update camera to follow player
        const player = levelManager.getPlayer();
        if (player && player.active) {
          engine.camera.follow(player);
        }
      },
      (alpha: number) => {
        // Render
        engine.render(alpha);
      }
    );
    gameLoopRef.current = gameLoop;

    // Start game loop
    gameLoop.start();

    // Cleanup
    return () => {
      gameLoop.stop();
      engine.destroy();
      window.removeEventListener('resize', resizeCanvas);
      document.removeEventListener('click', resumeAudio);
      document.removeEventListener('keydown', resumeAudio);
    };
  }, [currentLevel, onGameOver, onLevelComplete]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: '100%',
        height: '100%',
        display: 'block',
        background: '#1a1a2e',
      }}
    />
  );
}
