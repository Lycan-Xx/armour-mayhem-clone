interface PauseScreenProps {
  onResume: () => void;
  onRestart: () => void;
  onQuit: () => void;
}

export function PauseScreen({ onResume, onRestart, onQuit }: PauseScreenProps) {
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
        background: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        fontFamily: 'monospace',
      }}
    >
      <h2 style={{ fontSize: '36px', marginBottom: '40px' }}>PAUSED</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <button
          onClick={onResume}
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
          RESUME
        </button>

        <button
          onClick={onRestart}
          style={{
            padding: '12px 35px',
            fontSize: '18px',
            background: '#E2A04A',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            fontFamily: 'monospace',
            fontWeight: 'bold',
          }}
        >
          RESTART
        </button>

        <button
          onClick={onQuit}
          style={{
            padding: '12px 35px',
            fontSize: '18px',
            background: '#E24A4A',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            fontFamily: 'monospace',
            fontWeight: 'bold',
          }}
        >
          QUIT TO MENU
        </button>
      </div>

      <div style={{ marginTop: '40px', fontSize: '14px', color: '#aaa' }}>
        Press ESC to resume
      </div>
    </div>
  );
}
