import { writeMeasures } from '@/lib/warp10';
import { getSensorById } from '@/lib/sensors';

// POST /api/gts/write
// Body: { sensorId, value, timestamp? }
export async function POST(request) {
  const body = await request.json();
  const { sensorId, value, timestamp } = body;

  if (!sensorId || value === undefined) {
    return Response.json(
      { error: 'Champs requis : sensorId, value' },
      { status: 400 }
    );
  }

  const sensor = getSensorById(sensorId);
  if (!sensor) {
    return Response.json({ error: 'Capteur introuvable' }, { status: 404 });
  }

  if (!sensor.active) {
    return Response.json({ error: 'Capteur inactif' }, { status: 403 });
  }

  // Validation du type de valeur selon le capteur
  if (sensor.type === 'status') {
    const allowed = ['nominal', 'warning', 'critical'];
    if (!allowed.includes(value)) {
      return Response.json(
        { error: `Valeur status invalide. Valeurs autorisées : ${allowed.join(', ')}` },
        { status: 400 }
      );
    }
  } else {
    if (typeof value !== 'number') {
      return Response.json(
        { error: 'La valeur doit être un nombre pour ce type de capteur' },
        { status: 400 }
      );
    }
  }

  await writeMeasures([
    {
      className: sensor.className,
      labels: { module: sensor.module, unit: sensor.unit },
      value: sensor.type === 'status' ? `'${value}'` : value,
      timestamp,
    },
  ]);

  return Response.json({
    status: 'ok',
    message: 'Mesure enregistrée',
    sensor: sensor.name,
    value,
    timestamp: timestamp ?? new Date().toISOString(),
  });
}