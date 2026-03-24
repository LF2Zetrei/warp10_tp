'use client';
import { useState } from 'react';
import StatusBadge from './StatusBadge';
import SensorChart from './SensorChart';

export default function SensorCard({ sensor }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="alien-card"
      style={{ padding: '20px', transition: 'border-color 0.15s' }}
      onMouseEnter={(e) => e.currentTarget.style.borderColor = '#33ff33'}
      onMouseLeave={(e) => e.currentTarget.style.borderColor = '#1a8c1a'}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <span style={{ fontSize: '12px', letterSpacing: '2px', color: '#33ff33', textTransform: 'uppercase' }}>
          {sensor.name}
        </span>
        <StatusBadge status={sensor.active ? 'nominal' : 'unknown'} />
      </div>

      {/* Infos */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginBottom: '12px' }}>
        {[
          { label: 'TYPE',  value: sensor.type  },
          { label: 'UNITÉ', value: sensor.unit  },
          { label: 'CLASS', value: sensor.className },
        ].map(({ label, value }) => (
          <div key={label}>
            <span style={{ fontSize: '9px', color: '#1a8c1a', letterSpacing: '2px' }}>{label} : </span>
            <span style={{ fontSize: '10px', color: '#33ff33', letterSpacing: '1px' }}>{value}</span>
          </div>
        ))}
      </div>

      {/* Bouton graphique */}
      {sensor.type !== 'status' && (
        <>
          <button
            onClick={() => setExpanded(!expanded)}
            style={{
              background: 'transparent',
              color: '#1a8c1a',
              border: '1px solid #0d4d0d',
              padding: '6px 14px',
              fontSize: '10px',
              letterSpacing: '2px',
              cursor: 'pointer',
              fontFamily: 'inherit',
              width: '100%',
              transition: 'all 0.15s',
              marginBottom: expanded ? '12px' : 0,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#1a8c1a'; e.currentTarget.style.color = '#33ff33'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#0d4d0d'; e.currentTarget.style.color = '#1a8c1a'; }}
          >
            {expanded ? '▲ MASQUER GRAPHIQUE' : '▼ AFFICHER GRAPHIQUE'}
          </button>

          {expanded && (
            <SensorChart
              sensorId={sensor.id}
              sensorName={sensor.name}
              unit={sensor.unit}
            />
          )}
        </>
      )}
    </div>
  );
}
