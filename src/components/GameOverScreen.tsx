interface GameOverScreenProps {
  score: number;
  onRestart: () => void;
  onMenu: () => void;
}

export function GameOverScreen({ score, onRestart, onMenu }: GameOverScreenProps) {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #2e1a1a 0%, #3e1616 100%)',
        color: 'white',
        fontFamily: 'monospace',
      }}
    >
      <h1 style={{ fontSize: '48px', marginBottom: '20px', color: '#ff4444' }}>GAME OVER</h1>

      <div style={{ fontSize: '24px', marginBottom: '40px', color: '#aaa' }}>
        FINAL SCORE: <span style={{ color: 'white', fontWeight: 'bold' }}>{score}</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <button
          onClick={onRestart}
          style={{
            padding: '12px 35px',
            fontSize: '18px',
            background: '#4A90E2',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            fontFamily: 'monospace',
            fontWeight: 'bold',
          }}
        >
          TRY AGAIN
        </button>

        <button
          onClick={onMenu}
          style={{
            padding: '12px 35px',
            fontSize: '18px',
            background: '#2E5C8A',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            fontFamily: 'monospace',
            fontWeight: 'bold',
          }}
        >
          MAIN MENU
        </button>
      </div>
    </div>
  );
}
