'use client';
import { useState } from 'react';

const TYPES   = ['temperature', 'pressure', 'atmosphere', 'power', 'status'];
const MODULES = ['Prometheus', 'Nostromo', 'Sulaco', 'Cheyenne', 'Auriga'];
const UNITS   = { temperature: 'celsius', pressure: 'hPa', atmosphere: 'percent', power: 'kW', status: 'string' };

export default function AddSensorForm({ onAdd }) {
  const [form, setForm] = useState({ name: '', type: 'temperature', module: 'Prometheus', unit: 'celsius' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function handleTypeChange(type) {
    setForm({ ...form, type, unit: UNITS[type] });
  }

  async function handleSubmit() {
    if (!form.name.trim()) { setError('Nom requis'); return; }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/sensors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      onAdd(data);
      setForm({ name: '', type: 'temperature', module: 'Prometheus', unit: 'celsius' });
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  const inputStyle = {
    background: '#000',
    color: '#33ff33',
    border: '1px solid #1a8c1a',
    padding: '8px 12px',
    fontSize: '11px',
    letterSpacing: '1px',
    fontFamily: 'inherit',
    outline: 'none',
    width: '100%',
  };

  const selectStyle = { ...inputStyle };

  return (
    <div className="alien-card" style={{ padding: '24px', marginBottom: '32px' }}>
      <div style={{ fontSize: '11px', letterSpacing: '3px', color: '#1a8c1a', marginBottom: '20px' }}>
        // AJOUTER UN CAPTEUR
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '16px' }}>
        {/* Nom */}
        <div>
          <div style={{ fontSize: '10px', color: '#1a8c1a', letterSpacing: '2px', marginBottom: '6px' }}>NOM</div>
          <input
            style={inputStyle}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="ex: Capteur X"
          />
        </div>

        {/* Type */}
        <div>
          <div style={{ fontSize: '10px', color: '#1a8c1a', letterSpacing: '2px', marginBottom: '6px' }}>TYPE</div>
          <select style={selectStyle} value={form.type} onChange={(e) => handleTypeChange(e.target.value)}>
            {TYPES.map((t) => <option key={t} value={t}>{t.toUpperCase()}</option>)}
          </select>
        </div>

        {/* Module */}
        <div>
          <div style={{ fontSize: '10px', color: '#1a8c1a', letterSpacing: '2px', marginBottom: '6px' }}>MODULE</div>
          <select style={selectStyle} value={form.module} onChange={(e) => setForm({ ...form, module: e.target.value })}>
            {MODULES.map((m) => <option key={m} value={m}>{m.toUpperCase()}</option>)}
          </select>
        </div>

        {/* Unité */}
        <div>
          <div style={{ fontSize: '10px', color: '#1a8c1a', letterSpacing: '2px', marginBottom: '6px' }}>UNITÉ</div>
          <input style={{ ...inputStyle, color: '#1a8c1a' }} value={form.unit} readOnly />
        </div>
      </div>

      {error && (
        <div style={{ color: '#ff3333', fontSize: '11px', letterSpacing: '1px', marginBottom: '12px' }}>
          // ERREUR : {error}
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{
          background: loading ? 'transparent' : '#33ff33',
          color: loading ? '#1a8c1a' : '#000',
          border: '1px solid #33ff33',
          padding: '10px 28px',
          fontSize: '11px',
          letterSpacing: '3px',
          cursor: loading ? 'not-allowed' : 'pointer',
          fontFamily: 'inherit',
          textTransform: 'uppercase',
          transition: 'all 0.15s',
        }}
      >
        {loading ? '// CRÉATION...' : '> CRÉER LE CAPTEUR'}
      </button>
    </div>
  );
}
