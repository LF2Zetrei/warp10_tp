'use client';
import { useState } from 'react';
import StatusBadge from './StatusBadge';

export default function SensorRow({ sensor, onToggle, onDelete }) {
  const [loading, setLoading] = useState(false);

  async function handleToggle() {
    setLoading(true);
    await onToggle(sensor.id, !sensor.active);
    setLoading(false);
  }

  async function handleDelete() {
    if (!confirm(`Supprimer ${sensor.name} ?`)) return;
    setLoading(true);
    await onDelete(sensor.id);
    setLoading(false);
  }

  return (
    <tr style={{
      borderBottom: '1px solid #0d4d0d',
      opacity: sensor.active ? 1 : 0.4,
      transition: 'opacity 0.2s',
    }}>
      <td style={{ padding: '14px 12px', fontSize: '12px', color: '#33ff33', letterSpacing: '1px' }}>
        {sensor.name}
      </td>
      <td style={{ padding: '14px 12px', fontSize: '11px', color: '#1a8c1a', letterSpacing: '2px' }}>
        {sensor.type.toUpperCase()}
      </td>
      <td style={{ padding: '14px 12px', fontSize: '11px', color: '#1a8c1a', letterSpacing: '2px' }}>
        {sensor.module.toUpperCase()}
      </td>
      <td style={{ padding: '14px 12px', fontSize: '11px', color: '#1a8c1a' }}>
        {sensor.unit}
      </td>
      <td style={{ padding: '14px 12px' }}>
        <StatusBadge status={sensor.active ? 'nominal' : 'unknown'} />
      </td>
      <td style={{ padding: '14px 12px' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          {/* Toggle */}
          <button
            onClick={handleToggle}
            disabled={loading}
            style={{
              background: sensor.active ? 'transparent' : '#33ff33',
              color: sensor.active ? '#ffaa00' : '#000',
              border: `1px solid ${sensor.active ? '#ffaa00' : '#33ff33'}`,
              padding: '6px 14px',
              fontSize: '10px',
              letterSpacing: '2px',
              cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'all 0.15s',
            }}
          >
            {sensor.active ? 'DISABLE' : 'ENABLE'}
          </button>

          {/* Delete */}
          <button
            onClick={handleDelete}
            disabled={loading}
            style={{
              background: 'transparent',
              color: '#ff3333',
              border: '1px solid #ff3333',
              padding: '6px 14px',
              fontSize: '10px',
              letterSpacing: '2px',
              cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'all 0.15s',
            }}
          >
            DELETE
          </button>
        </div>
      </td>
    </tr>
  );
}
