import { useState } from 'react';
import { GameCanvas } from './components/GameCanvas';
import { Menu } from './components/Menu';
import { PauseScreen } from './components/PauseScreen';
import { GameOverScreen } from './components/GameOverScreen';
import { LevelCompleteScreen } from './components/LevelCompleteScreen';
import { HUD } from './components/HUD';
import { getLevelCount } from './data/levels';

type GameState = 'menu' | 'playing' | 'paused' | 'gameOver' | 'levelComplete';

function App() {
  const [gameState, setGameState] = useState<GameState>('menu');
  const [currentLevel, setCurrentLevel] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  
  // Mock HUD data (would be updated from game engine in real implementation)
  const [hudData, setHudData] = useState({
    health: 100,
    maxHealth: 100,
    weaponName: 'Pistol',
    currentAmmo: 12,
    magazineSize: 12,
  });

  const handleStart = () => {
    setGameState('playing');
    setCurrentLevel(0);
    setScore(0);
    setLives(3);
  };

  const handleLevelSelect = (level: number) => {
    setGameState('playing');
    setCurrentLevel(level);
    setScore(0);
    setLives(3);
  };

  const handlePause = () => {
    setGameState('paused');
  };

  const handleResume = () => {
    setGameState('playing');
  };

  const handleRestart = () => {
    setGameState('playing');
    setScore(0);
    setLives(3);
  };

  const handleQuitToMenu = () => {
    setGameState('menu');
  };

  const handleGameOver = () => {
    setGameState('gameOver');
  };

  const handleLevelComplete = () => {
    setGameState('levelComplete');
    setScore(score + 1000); // Add bonus score
  };

  const handleNextLevel = () => {
    const nextLevel = currentLevel + 1;
    if (nextLevel < getLevelCount()) {
      setCurrentLevel(nextLevel);
      setGameState('playing');
    } else {
      setGameState('menu');
    }
  };

  const hasNextLevel = currentLevel + 1 < getLevelCount();

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        position: 'relative',
        background: '#000',
      }}
    >
      {/* Game Canvas */}
      {(gameState === 'playing' || gameState === 'paused') && (
        <GameCanvas
          currentLevel={currentLevel}
          onGameOver={handleGameOver}
          onLevelComplete={handleLevelComplete}
        />
      )}

      {/* HUD */}
      {gameState === 'playing' && (
        <HUD
          health={hudData.health}
          maxHealth={hudData.maxHealth}
          weaponName={hudData.weaponName}
          currentAmmo={hudData.currentAmmo}
          magazineSize={hudData.magazineSize}
          score={score}
          lives={lives}
        />
      )}

      {/* Menu */}
      {gameState === 'menu' && (
        <Menu onStart={handleStart} onLevelSelect={handleLevelSelect} />
      )}

      {/* Pause Screen */}
      {gameState === 'paused' && (
        <PauseScreen
          onResume={handleResume}
          onRestart={handleRestart}
          onQuit={handleQuitToMenu}
        />
      )}

      {/* Game Over Screen */}
      {gameState === 'gameOver' && (
        <GameOverScreen
          score={score}
          onRestart={handleRestart}
          onMenu={handleQuitToMenu}
        />
      )}

      {/* Level Complete Screen */}
      {gameState === 'levelComplete' && (
        <LevelCompleteScreen
          levelScore={score}
          onNextLevel={handleNextLevel}
          onMenu={handleQuitToMenu}
          hasNextLevel={hasNextLevel}
        />
      )}
    </div>
  );
}

export default App;
