import ModuleCard from './components/ModuleCard';
import SectionTitle from './components/SectionTitle';
import SimulateButton from './components/SimulateButton';

const MODULES = ['Prometheus', 'Nostromo', 'Sulaco', 'Cheyenne', 'Auriga'];

async function getSensors() {
  const res = await fetch('http://localhost:3000/api/sensors', { cache: 'no-store' });
  return res.json();
}

export default async function Dashboard() {
  const sensors = await getSensors();

  const sensorsByModule = MODULES.reduce((acc: Record<string, any[]>, module) => {
    acc[module] = sensors.filter((s: any) => s.module === module);
    return acc;
  }, {});

  const stats = [
    { label: 'MODULES',  value: MODULES.length },
    { label: 'CAPTEURS', value: sensors.length },
    { label: 'ACTIFS',   value: sensors.filter((s: any) => s.active).length },
    { label: 'TYPES',    value: [...new Set(sensors.map((s: any) => s.type))].length },
  ];

  return (
    <main style={{ padding: '40px 48px', maxWidth: '1400px', margin: '0 auto' }}>

      {/* Stats globales */}
      <SectionTitle>System Status</SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '40px' }}>
        {stats.map(({ label, value }) => (
          <div key={label} className="alien-card" style={{ padding: '24px' }}>
            <div style={{ fontSize: '11px', letterSpacing: '3px', color: '#1a8c1a', marginBottom: '12px' }}>{label}</div>
            <div style={{ fontSize: '48px', color: '#33ff33', lineHeight: 1 }}>{String(value).padStart(2, '0')}</div>
          </div>
        ))}
      </div>

      {/* Simulation */}
      <SectionTitle>Data Simulation</SectionTitle>
      <div style={{ marginBottom: '40px' }}>
        <SimulateButton />
      </div>

      {/* Modules */}
      <SectionTitle>Module Status</SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        {MODULES.map((module) => (
          <ModuleCard key={module} module={module} sensors={sensorsByModule[module] ?? []} />
        ))}
      </div>

    </main>
  );
}
