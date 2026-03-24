'use client';
import { useState, useEffect } from 'react';
import SectionTitle from '../components/SectionTitle';
import StatsTable from '../components/StatsTable';
import StatusStats from '../components/StatusStats';

const TYPES = ['temperature', 'pressure', 'atmosphere', 'power', 'status'];

const LABELS: Record<string, { label: string; unit: string }> = {
  temperature: { label: 'TEMPÉRATURE', unit: '°C'  },
  pressure:    { label: 'PRESSION',     unit: 'hPa' },
  atmosphere:  { label: 'ATMOSPHÈRE',   unit: '%'   },
  power:       { label: 'PUISSANCE',    unit: 'kW'  },
  status:      { label: 'ÉTAT MODULES', unit: ''    },
};

export default function StatsPage() {
  const [activeType, setActiveType] = useState('temperature');
  const [allStats, setAllStats]     = useState<Record<string, any>>({});
  const [loading, setLoading]       = useState<Record<string, boolean>>({});
  const [range, setRange]           = useState('24');

  useEffect(() => {
    fetchStats(activeType);
  }, [activeType, range]);

  async function fetchStats(type: string) {
    const key = `${type}-${range}`;
    if (allStats[key]) return;
    setLoading((prev) => ({ ...prev, [type]: true }));
    try {
      const end   = new Date().toISOString();
      const start = new Date(Date.now() - parseInt(range) * 3600 * 1000).toISOString();
      const res   = await fetch(`/api/gts/analyze?type=${type}&start=${start}&end=${end}`);
      const data  = await res.json();
      setAllStats((prev) => ({ ...prev, [key]: data.stats }));
    } finally {
      setLoading((prev) => ({ ...prev, [type]: false }));
    }
  }

  const currentStats = allStats[`${activeType}-${range}`] ?? [];
  const isLoading    = loading[activeType];

  // Moyennes globales (types numériques uniquement)
  const globalMeans = ['temperature', 'pressure', 'atmosphere', 'power'].map((type) => {
    const stats = allStats[`${type}-${range}`] ?? [];
    if (!stats.length) return null;
    const avg = stats.reduce((acc: number, s: any) => acc + (s.mean ?? 0), 0) / stats.length;
    return { type, avg };
  }).filter(Boolean);

  return (
    <main style={{ padding: '40px 48px', maxWidth: '1400px', margin: '0 auto' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
        <div>
          <h2 style={{ fontSize: '20px', letterSpacing: '6px', color: '#33ff33', margin: 0 }}>
            STATISTIQUES GÉNÉRALES
          </h2>
          <p style={{ fontSize: '11px', color: '#1a8c1a', letterSpacing: '2px', marginTop: '6px' }}>
            ANALYSE COMPLÈTE — TOUS MODULES
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '10px', color: '#1a8c1a', letterSpacing: '2px' }}>PÉRIODE :</span>
          {['6', '12', '24', '48'].map((h) => (
            <button key={h} onClick={() => setRange(h)} style={{
              background: range === h ? '#33ff33' : 'transparent',
              color: range === h ? '#000' : '#1a8c1a',
              border: `1px solid ${range === h ? '#33ff33' : '#1a8c1a'}`,
              padding: '6px 14px', fontSize: '10px', letterSpacing: '2px',
              cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s',
            }}>
              {h}H
            </button>
          ))}
        </div>
      </div>

      {/* Moyennes globales */}
      {globalMeans.length > 0 && (
        <>
          <SectionTitle>Moyennes globales</SectionTitle>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '40px' }}>
            {globalMeans.map(({ type, avg }: any) => (
              <div key={type} className="alien-card" style={{ padding: '20px' }}>
                <div style={{ fontSize: '10px', letterSpacing: '3px', color: '#1a8c1a', marginBottom: '8px', textTransform: 'uppercase' }}>
                  {LABELS[type]?.label}
                </div>
                <div style={{ fontSize: '32px', color: '#33ff33', lineHeight: 1 }}>
                  {avg.toFixed(1)}
                </div>
                <div style={{ fontSize: '10px', color: '#1a8c1a', marginTop: '4px' }}>
                  {LABELS[type]?.unit} — MOY. TOUS MODULES
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Sélecteur type */}
      <SectionTitle>Détail par type de capteur</SectionTitle>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {TYPES.map((type) => (
          <button key={type} onClick={() => setActiveType(type)} style={{
            background: activeType === type ? '#33ff33' : 'transparent',
            color: activeType === type ? '#000' : '#1a8c1a',
            border: `1px solid ${activeType === type ? '#33ff33' : '#1a8c1a'}`,
            padding: '8px 20px', fontSize: '11px', letterSpacing: '2px',
            cursor: 'pointer', fontFamily: 'inherit', textTransform: 'uppercase', transition: 'all 0.15s',
          }}>
            {LABELS[type]?.label}
          </button>
        ))}
      </div>

      {/* Contenu */}
      <div className="alien-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #1a8c1a', display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '11px', letterSpacing: '3px', color: '#1a8c1a' }}>
            // {LABELS[activeType]?.label} {LABELS[activeType]?.unit ? `— ${LABELS[activeType].unit}` : ''}
          </span>
          <span style={{ fontSize: '10px', color: '#1a8c1a' }}>
            {currentStats.length} MODULES
          </span>
        </div>

        {isLoading ? (
          <div style={{ padding: '32px', textAlign: 'center', color: '#1a8c1a', letterSpacing: '3px', fontSize: '12px' }}>
            // CALCUL EN COURS...
          </div>
        ) : activeType === 'status' ? (
          <StatusStats stats={currentStats} />
        ) : (
          <StatsTable stats={currentStats} type={activeType} />
        )}
      </div>

    </main>
  );
}