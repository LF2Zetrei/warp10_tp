'use client';
import { useState, useEffect } from 'react';
import SectionTitle from '../components/SectionTitle';
import AddSensorForm from '../components/AddSensorForm';
import SensorRow from '../components/SensorRow';

const TYPES = ['all', 'temperature', 'pressure', 'atmosphere', 'power', 'status'];

export default function SensorsPage() {
  const [sensors, setSensors] = useState([]);
  const [filter, setFilter]   = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSensors();
  }, []);

  async function fetchSensors() {
    setLoading(true);
    const res = await fetch('/api/sensors');
    const data = await res.json();
    setSensors(data);
    setLoading(false);
  }

  async function handleToggle(id: string, active: boolean) {
    await fetch(`/api/sensors/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active }),
    });
    setSensors((prev) => prev.map((s) => s.id === id ? { ...s, active } : s));
  }

  async function handleDelete(id: string) {
    await fetch(`/api/sensors/${id}`, { method: 'DELETE' });
    setSensors((prev) => prev.filter((s) => s.id !== id));
  }

  function handleAdd(sensor: any) {
    setSensors((prev) => [...prev, sensor]);
  }

  const filtered = filter === 'all' ? sensors : sensors.filter((s: any) => s.type === filter);
  const activeCount = sensors.filter((s: any) => s.active).length;

  return (
    <main style={{ padding: '40px 48px', maxWidth: '1400px', margin: '0 auto' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <h2 style={{ fontSize: '20px', letterSpacing: '6px', color: '#33ff33', margin: 0 }}>
            GESTION CAPTEURS
          </h2>
          <p style={{ fontSize: '11px', color: '#1a8c1a', letterSpacing: '2px', marginTop: '6px' }}>
            {activeCount} ACTIFS / {sensors.length} TOTAL
          </p>
        </div>
      </div>

      {/* Formulaire ajout */}
      <AddSensorForm onAdd={handleAdd} />

      {/* Filtres */}
      <SectionTitle>Filtrer par type</SectionTitle>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {TYPES.map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            style={{
              background: filter === type ? '#33ff33' : 'transparent',
              color: filter === type ? '#000' : '#1a8c1a',
              border: `1px solid ${filter === type ? '#33ff33' : '#1a8c1a'}`,
              padding: '6px 16px',
              fontSize: '10px',
              letterSpacing: '2px',
              cursor: 'pointer',
              fontFamily: 'inherit',
              textTransform: 'uppercase',
              transition: 'all 0.15s',
            }}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Tableau */}
      <SectionTitle>Liste des capteurs</SectionTitle>
      <div className="alien-card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '32px', textAlign: 'center', color: '#1a8c1a', letterSpacing: '3px', fontSize: '12px' }}>
            // CHARGEMENT...
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #1a8c1a' }}>
                {['NOM', 'TYPE', 'MODULE', 'UNITÉ', 'STATUT', 'ACTIONS'].map((h) => (
                  <th key={h} style={{
                    padding: '14px 12px',
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
              {filtered.map((sensor: any) => (
                <SensorRow
                  key={sensor.id}
                  sensor={sensor}
                  onToggle={handleToggle}
                  onDelete={handleDelete}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>

    </main>
  );
}
