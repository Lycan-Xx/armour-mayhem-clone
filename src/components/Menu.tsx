interface MenuProps {
  onStart: () => void;
  onLevelSelect: (level: number) => void;
}

export function Menu({ onStart, onLevelSelect }: MenuProps) {
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
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        color: 'white',
        fontFamily: 'monospace',
      }}
    >
      <h1 style={{ fontSize: '48px', marginBottom: '50px', textShadow: '3px 3px 6px rgba(0,0,0,0.5)' }}>
        ARMOR MAYHEM
      </h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <button
          onClick={onStart}
          style={{
            padding: '15px 40px',
            fontSize: '20px',
            background: '#4A90E2',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            fontFamily: 'monospace',
            fontWeight: 'bold',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#357ABD';
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#4A90E2';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          START GAME
        </button>

        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <div style={{ marginBottom: '10px', fontSize: '14px', color: '#aaa' }}>SELECT LEVEL</div>
          <div style={{ display: 'flex', gap: '10px' }}>
            {[1, 2, 3].map((level) => (
              <button
                key={level}
                onClick={() => onLevelSelect(level - 1)}
                style={{
                  padding: '10px 20px',
                  fontSize: '16px',
                  background: '#2E5C8A',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                  fontFamily: 'monospace',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#1E4C7A';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#2E5C8A';
                }}
              >
                LEVEL {level}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: '30px',
          fontSize: '14px',
          color: '#666',
        }}
      >
        <div>WASD - Move | SPACE - Jump | MOUSE - Aim | CLICK - Shoot | F - Swap Weapon</div>
      </div>
    </div>
  );
}
