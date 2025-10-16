interface HUDProps {
  health: number;
  maxHealth: number;
  weaponName: string;
  currentAmmo: number;
  magazineSize: number;
  score: number;
  lives: number;
}

export function HUD({
  health,
  maxHealth,
  weaponName,
  currentAmmo,
  magazineSize,
  score,
  lives,
}: HUDProps) {
  const healthPercent = (health / maxHealth) * 100;

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        padding: '20px',
        color: 'white',
        fontFamily: 'monospace',
        fontSize: '16px',
        pointerEvents: 'none',
        userSelect: 'none',
      }}
    >
      {/* Top left - Health and weapon info */}
      <div style={{ display: 'flex', gap: '30px' }}>
        {/* Health bar */}
        <div>
          <div style={{ marginBottom: '5px' }}>HEALTH</div>
          <div
            style={{
              width: '200px',
              height: '20px',
              background: '#333',
              border: '2px solid #666',
              position: 'relative',
            }}
          >
            <div
              style={{
                width: `${healthPercent}%`,
                height: '100%',
                background: healthPercent > 50 ? '#00ff00' : healthPercent > 25 ? '#ffaa00' : '#ff0000',
                transition: 'width 0.3s',
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                color: 'white',
                fontSize: '12px',
                fontWeight: 'bold',
                textShadow: '1px 1px 2px black',
              }}
            >
              {health} / {maxHealth}
            </div>
          </div>
        </div>

        {/* Weapon info */}
        <div>
          <div style={{ marginBottom: '5px' }}>WEAPON</div>
          <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{weaponName}</div>
          <div style={{ fontSize: '14px', color: '#aaa' }}>
            {currentAmmo} / {magazineSize}
          </div>
        </div>
      </div>

      {/* Top right - Score and lives */}
      <div
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          textAlign: 'right',
        }}
      >
        <div style={{ marginBottom: '10px' }}>
          <div style={{ fontSize: '12px', color: '#aaa' }}>SCORE</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{score}</div>
        </div>
        <div>
          <div style={{ fontSize: '12px', color: '#aaa' }}>LIVES</div>
          <div style={{ fontSize: '20px' }}>{'❤️ '.repeat(lives)}</div>
        </div>
      </div>
    </div>
  );
}
