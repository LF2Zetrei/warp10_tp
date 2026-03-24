'use client';
import Link from 'next/link';
import StatusBadge from './StatusBadge';

export default function ModuleCard({ module, sensors }) {
  const activeSensors = sensors.filter((s) => s.active).length;
  const sensorTypes = [...new Set(sensors.map((s) => s.type))];

  return (
    <Link href={`/modules/${module}`} style={{ textDecoration: 'none' }}>
      <div
        className="alien-card"
        style={{ cursor: 'pointer', transition: 'border-color 0.15s', padding: '28px' }}
        onMouseEnter={(e) => e.currentTarget.style.borderColor = '#33ff33'}
        onMouseLeave={(e) => e.currentTarget.style.borderColor = '#1a8c1a'}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <span style={{ fontSize: '18px', letterSpacing: '4px', textTransform: 'uppercase', color: '#33ff33' }}>
            {module}
          </span>
          <StatusBadge status="nominal" />
        </div>

        {/* Separateur */}
        <div style={{ borderTop: '1px solid #0d4d0d', marginBottom: '20px' }} />

        {/* Infos */}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#1a8c1a', marginBottom: '8px' }}>
          <span>CAPTEURS ACTIFS</span>
          <span style={{ color: '#33ff33' }}>{activeSensors} / {sensors.length}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#1a8c1a', marginBottom: '20px' }}>
          <span>TYPES DE CAPTEURS</span>
          <span style={{ color: '#33ff33' }}>{sensorTypes.length}</span>
        </div>

        {/* Tags */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
          {sensorTypes.map((type) => (
            <span key={type} style={{
              fontSize: '10px',
              border: '1px solid #0d4d0d',
              color: '#1a8c1a',
              padding: '4px 10px',
              letterSpacing: '1px',
              textTransform: 'uppercase',
            }}>
              {type}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div style={{
          paddingTop: '16px',
          borderTop: '1px solid #0d4d0d',
          fontSize: '11px',
          color: '#1a8c1a',
          letterSpacing: '2px',
          display: 'flex',
          justifyContent: 'space-between',
        }}>
          <span>ACCESS MODULE DETAILS</span>
          <span style={{ color: '#33ff33' }}>&gt;&gt;</span>
        </div>
      </div>
    </Link>
  );
}
