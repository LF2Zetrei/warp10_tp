import { writeMeasures } from '@/lib/warp10';
import { getAllSensors } from '@/lib/sensors';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

// Génère une valeur réaliste selon le type de capteur
function generateValue(sensor) {
  switch (sensor.type) {
    case 'temperature':
      // Entre 18°C et 26°C avec légère variation
      return parseFloat((18 + Math.random() * 8).toFixed(1));

    case 'pressure':
      // Pression atmosphérique station spatiale ~1013 hPa ± 5
      return parseFloat((1010 + Math.random() * 6).toFixed(1));

    case 'atmosphere':
      // O2 entre 19% et 23%
      return parseFloat((19 + Math.random() * 4).toFixed(2));

    case 'power':
      // Consommation entre 10 et 80 kW
      return Math.floor(10 + Math.random() * 70);

    case 'status':
      // 80% nominal, 15% warning, 5% critical
      const rand = Math.random();
      if (rand < 0.80) return 'nominal';
      if (rand < 0.95) return 'warning';
      return 'critical';

    default:
      return 0;
  }
}

// POST /api/gts/simulate
// Body: { hours? } — nombre d'heures à simuler (défaut: 24)
export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const hours = body.hours ?? 24;
  const intervalMinutes = 15; // 1 point toutes les 15 min

  const sensors = getAllSensors().filter((s) => s.active);
  const now = dayjs().utc();
  const measures = [];

  // Pour chaque capteur, générer des points sur la période
  for (const sensor of sensors) {
    const totalPoints = (hours * 60) / intervalMinutes;

    for (let i = totalPoints; i >= 0; i--) {
      const timestamp = now.subtract(i * intervalMinutes, 'minute');
      const value = generateValue(sensor);

      measures.push({
        className: sensor.className,
        labels: { module: sensor.module, unit: sensor.unit },
        value: value,
        timestamp: timestamp.toISOString(),
      });
    }
  }

  // Envoie par batch de 500 pour ne pas surcharger Warp10
  const batchSize = 500;
  let sent = 0;

  for (let i = 0; i < measures.length; i += batchSize) {
    const batch = measures.slice(i, i + batchSize);
    await writeMeasures(batch);
    sent += batch.length;
  }

  return Response.json({
    status: 'ok',
    message: `Simulation terminée`,
    sensors: sensors.length,
    hours,
    pointsParCapteur: (hours * 60) / intervalMinutes + 1,
    totalPoints: sent,
  });
}