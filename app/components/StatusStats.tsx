'use client';

export default function StatusStats({ stats }: { stats: any[] }) {
  if (!stats?.length) return (
    <div style={{ padding: '24px', textAlign: 'center', color: '#1a8c1a', fontSize: '11px', letterSpacing: '2px' }}>
      // AUCUNE DONNÉE DISPONIBLE
    </div>
  );

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', padding: '16px' }}>
      {stats.map((row: any) => {
        const score = row.healthScore ?? 0;
        const color = score >= 80 ? '#33ff33' : score >= 50 ? '#ffaa00' : '#ff3333';

        return (
          <div key={row.module} className="alien-card" style={{ padding: '20px' }}>

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontSize: '13px', letterSpacing: '3px', color: '#33ff33', textTransform: 'uppercase' }}>
                {row.module}
              </span>
              <span style={{ fontSize: '18px', color, letterSpacing: '1px', fontWeight: 'bold' }}>
                {Math.round(score)}%
              </span>
            </div>

            {/* Barre de santé */}
            <div style={{ background: '#0d4d0d', height: '4px', marginBottom: '16px', position: 'relative' }}>
              <div style={{
                position: 'absolute', top: 0, left: 0,
                width: `${score}%`, height: '100%',
                background: color,
                transition: 'width 0.5s',
              }} />
            </div>

            {/* Distribution */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { label: 'NOMINAL',  value: row.nominal,  color: '#33ff33' },
                { label: 'WARNING',  value: row.warning,  color: '#ffaa00' },
                { label: 'CRITICAL', value: row.critical, color: '#ff3333' },
              ].map(({ label, value, color: c }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '10px', color: '#1a8c1a', letterSpacing: '2px' }}>{label}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '80px', background: '#0d4d0d', height: '3px' }}>
                      <div style={{
                        width: `${row.total > 0 ? (value / row.total) * 100 : 0}%`,
                        height: '100%',
                        background: c,
                      }} />
                    </div>
                    <span style={{ fontSize: '11px', color: c, minWidth: '24px', textAlign: 'right' }}>
                      {value}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Total */}
            <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid #0d4d0d', fontSize: '10px', color: '#1a8c1a', letterSpacing: '1px' }}>
              TOTAL : {row.total} MESURES
            </div>
          </div>
        );
      })}
    </div>
  );
}
