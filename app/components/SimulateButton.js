'use client';
import { useState } from 'react';

export default function SimulateButton() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [hours, setHours] = useState(24);

  async function handleSimulate() {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch('/api/gts/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hours }),
      });
      const data = await res.json();
      setResult(data);
    } catch (e) {
      setResult({ status: 'error', message: e.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="alien-card" style={{ padding: '24px' }}>
      <div style={{ fontSize: '11px', letterSpacing: '3px', color: '#1a8c1a', marginBottom: '16px' }}>
        // SIMULATION DE DONNÉES
      </div>

      {/* Contrôles */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
        <span style={{ fontSize: '12px', color: '#1a8c1a', letterSpacing: '1px' }}>DURÉE :</span>
        {[6, 12, 24, 48].map((h) => (
          <button
            key={h}
            onClick={() => setHours(h)}
            style={{
              background: hours === h ? '#33ff33' : 'transparent',
              color: hours === h ? '#000' : '#1a8c1a',
              border: `1px solid ${hours === h ? '#33ff33' : '#1a8c1a'}`,
              padding: '6px 16px',
              fontSize: '11px',
              letterSpacing: '2px',
              cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'all 0.15s',
            }}
          >
            {h}H
          </button>
        ))}
      </div>

      {/* Bouton lancer */}
      <button
        onClick={handleSimulate}
        disabled={loading}
        style={{
          background: loading ? 'transparent' : '#33ff33',
          color: loading ? '#1a8c1a' : '#000',
          border: '1px solid #33ff33',
          padding: '12px 32px',
          fontSize: '12px',
          letterSpacing: '3px',
          cursor: loading ? 'not-allowed' : 'pointer',
          fontFamily: 'inherit',
          textTransform: 'uppercase',
          width: '100%',
          transition: 'all 0.15s',
        }}
      >
        {loading ? '// SIMULATION EN COURS...' : '> LANCER LA SIMULATION'}
      </button>

      {/* Résultat */}
      {result && (
        <div style={{
          marginTop: '16px',
          padding: '12px',
          border: `1px solid ${result.status === 'ok' ? '#1a8c1a' : '#ff3333'}`,
          fontSize: '11px',
          color: result.status === 'ok' ? '#33ff33' : '#ff3333',
          letterSpacing: '1px',
        }}>
          {result.status === 'ok' ? (
            <>
              <div>// SIMULATION TERMINÉE</div>
              <div style={{ color: '#1a8c1a', marginTop: '6px' }}>
                CAPTEURS    : {result.sensors}<br/>
                DURÉE       : {result.hours}H<br/>
                POINTS/CAPT : {result.pointsParCapteur}<br/>
                TOTAL       : {result.totalPoints} POINTS
              </div>
            </>
          ) : (
            <div>// ERREUR : {result.message}</div>
          )}
        </div>
      )}
    </div>
  );
}
