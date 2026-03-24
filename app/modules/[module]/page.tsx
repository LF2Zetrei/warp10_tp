import SectionTitle from '../../components/SectionTitle';
import SensorCard from '../../components/SensorCard';
import StatusBadge from '../../components/StatusBadge';
import Link from 'next/link';

const SENSOR_TYPES = ['temperature', 'pressure', 'atmosphere', 'power'];

async function getSensors() {
  const res = await fetch('http://localhost:3000/api/sensors', { cache: 'no-store' });
  return res.json();
}

async function getStats(type: string) {
  const res = await fetch(`http://localhost:3000/api/gts/analyze?type=${type}`, { cache: 'no-store' });
  return res.json();
}

export default async function ModulePage({ params }: { params: { module: string } }) {
  const { module } = await params;
  const allSensors = await getSensors();
  const sensors = allSensors.filter((s: any) => s.module === module);

  // Stats pour chaque type numérique
  const statsResults = await Promise.all(
    SENSOR_TYPES.map((type) => getStats(type))
  );

  // Extraire les stats pour ce module
  const moduleStats = SENSOR_TYPES.reduce((acc: any, type, i) => {
    const stat = statsResults[i]?.stats?.find((s: any) => s.module === module);
    if (stat) acc[type] = stat;
    return acc;
  }, {});

  const activeSensors = sensors.filter((s: any) => s.active).length;
  const statusSensor  = sensors.find((s: any) => s.type === 'status');

  return (
    <main style={{ padding: '40px 48px', maxWidth: '1400px', margin: '0 auto' }}>

      {/* Breadcrumb */}
      <div style={{ fontSize: '10px', color: '#1a8c1a', letterSpacing: '2px', marginBottom: '24px' }}>
        <Link href="/" style={{ color: '#1a8c1a', textDecoration: 'none' }}>DASHBOARD</Link>
        <span style={{ margin: '0 8px' }}>/</span>
        <span style={{ color: '#33ff33' }}>{module.toUpperCase()}</span>
      </div>

      {/* Header module */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
        <div>
          <h2 style={{ fontSize: '28px', letterSpacing: '8px', color: '#33ff33', margin: 0, textTransform: 'uppercase' }}>
            MODULE {module}
          </h2>
          <p style={{ fontSize: '11px', color: '#1a8c1a', letterSpacing: '2px', marginTop: '8px' }}>
            {activeSensors} CAPTEURS ACTIFS / {sensors.length} TOTAL
          </p>
        </div>
        <StatusBadge status={statusSensor ? 'nominal' : 'unknown'} />
      </div>

      {/* Stats du module */}
      <SectionTitle>Statistiques du module</SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '40px' }}>
        {SENSOR_TYPES.map((type) => {
          const stat = moduleStats[type];
          return (
            <div key={type} className="alien-card" style={{ padding: '20px' }}>
              <div style={{ fontSize: '10px', letterSpacing: '3px', color: '#1a8c1a', marginBottom: '12px', textTransform: 'uppercase' }}>
                {type}
              </div>
              {stat ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {[
                    { label: 'MEAN',   value: stat.mean?.toFixed(2)   },
                    { label: 'MEDIAN', value: stat.median?.toFixed(2) },
                    { label: 'Q1',     value: stat.q1?.toFixed(2)     },
                    { label: 'Q3',     value: stat.q3?.toFixed(2)     },
                    { label: 'P99',    value: stat.p99?.toFixed(2)    },
                  ].map(({ label, value }) => (
                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
                      <span style={{ color: '#1a8c1a', letterSpacing: '1px' }}>{label}</span>
                      <span style={{ color: '#33ff33' }}>{value ?? '—'}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ fontSize: '11px', color: '#1a8c1a' }}>// NO DATA</div>
              )}
            </div>
          );
        })}
      </div>

      {/* Capteurs */}
      <SectionTitle>Capteurs du module</SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
        {sensors.map((sensor: any) => (
          <SensorCard key={sensor.id} sensor={sensor} />
        ))}
      </div>

    </main>
  );
}
