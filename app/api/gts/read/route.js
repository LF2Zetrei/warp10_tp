import { readGTS } from '@/lib/warp10';
import { getSensorById } from '@/lib/sensors';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

// GET /api/gts/read?sensorId=xxx&start=ISO&end=ISO
export async function GET(request) {
  const { searchParams } = new URL(request.url);

  const sensorId = searchParams.get('sensorId');
  const start    = searchParams.get('start');
  const end      = searchParams.get('end');

  if (!sensorId) {
    return Response.json(
      { error: 'Paramètre requis : sensorId' },
      { status: 400 }
    );
  }

  const sensor = getSensorById(sensorId);
  if (!sensor) {
    return Response.json({ error: 'Capteur introuvable' }, { status: 404 });
  }

  const data = await readGTS({
    className: sensor.className,
    labels: { module: sensor.module },
    start: start ?? dayjs().utc().subtract(24, 'hour').toISOString(),
    end:   end   ?? dayjs().utc().toISOString(),
  });

  return Response.json({
    sensor: {
      id:        sensor.id,
      name:      sensor.name,
      type:      sensor.type,
      module:    sensor.module,
      unit:      sensor.unit,
      className: sensor.className,
    },
    range: {
      start: start ?? dayjs().utc().subtract(24, 'hour').toISOString(),
      end:   end   ?? dayjs().utc().toISOString(),
    },
    data: data.result,
  });
}