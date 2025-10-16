interface LevelCompleteScreenProps {
  levelScore: number;
  onNextLevel: () => void;
  onMenu: () => void;
  hasNextLevel: boolean;
}

export function LevelCompleteScreen({
  levelScore,
  onNextLevel,
  onMenu,
  hasNextLevel,
}: LevelCompleteScreenProps) {
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
        background: 'linear-gradient(135deg, #1a2e1a 0%, #163e16 100%)',
        color: 'white',
        fontFamily: 'monospace',
      }}
    >
      <h1 style={{ fontSize: '48px', marginBottom: '20px', color: '#44ff44' }}>
        LEVEL COMPLETE!
      </h1>

      <div style={{ fontSize: '24px', marginBottom: '40px', color: '#aaa' }}>
        SCORE: <span style={{ color: 'white', fontWeight: 'bold' }}>{levelScore}</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {hasNextLevel && (
          <button
            onClick={onNextLevel}
            style={{
              padding: '12px 35px',
              fontSize: '18px',
              background: '#4AE24A',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              fontFamily: 'monospace',
              fontWeight: 'bold',
            }}
          >
            NEXT LEVEL
          </button>
        )}

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

      {!hasNextLevel && (
        <div style={{ marginTop: '30px', fontSize: '18px', color: '#44ff44' }}>
          🎉 YOU COMPLETED ALL LEVELS! 🎉
        </div>
      )}
    </div>
  );
}
