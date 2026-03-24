'use client';

const UNITS = {
  temperature: '°C',
  pressure:    'hPa',
  atmosphere:  '%',
  power:       'kW',
};

export default function StatsTable({ stats, type }) {
  if (!stats?.length) return (
    <div style={{ padding: '24px', textAlign: 'center', color: '#1a8c1a', fontSize: '11px', letterSpacing: '2px' }}>
      // AUCUNE DONNÉE DISPONIBLE
    </div>
  );

  const unit = UNITS[type] ?? '';

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr style={{ borderBottom: '1px solid #1a8c1a' }}>
          {['MODULE', 'MEAN', 'MEDIAN', 'Q1', 'Q3', 'P99', 'POINTS'].map((h) => (
            <th key={h} style={{
              padding: '12px 16px',
              textAlign: 'left',
              fontSize: '10px',
              letterSpacing: '3px',
              color: '#1a8c1a',
              fontWeight: 'normal',
            }}>
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {stats.map((row: any) => (
          <tr key={row.module} style={{ borderBottom: '1px solid #0d4d0d', transition: 'background 0.15s' }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(51,255,51,0.03)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <td style={{ padding: '12px 16px', fontSize: '12px', color: '#33ff33', letterSpacing: '2px' }}>
              {row.module?.toUpperCase()}
            </td>
            {['mean', 'median', 'q1', 'q3', 'p99'].map((key) => (
              <td key={key} style={{ padding: '12px 16px', fontSize: '12px', color: '#33ff33' }}>
                {row[key] != null ? `${row[key].toFixed(2)} ${unit}` : '—'}
              </td>
            ))}
            <td style={{ padding: '12px 16px', fontSize: '11px', color: '#1a8c1a' }}>
              {row.points}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
