import { writeMeasures, readGTS } from '@/lib/warp10';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

export async function GET() {
  try {
    // 1. Écriture de mesures de test
    await writeMeasures([
      {
        className: 'station.temperature',
        labels: { module: 'Columbus', unit: 'celsius' },
        value: 21.5,
      },
      {
        className: 'station.pressure',
        labels: { module: 'Columbus', unit: 'hPa' },
        value: 1013.2,
      },
      {
        className: 'station.atmosphere',
        labels: { module: 'Columbus', gas: 'O2' },
        value: 20.9,
      },
    ]);

    // 2. Lecture des dernières 24h
    const data = await readGTS({
      className: 'station.temperature',
      labels: { module: 'Columbus' },
      start: dayjs().utc().subtract(24, 'hour').toISOString(),
      end: dayjs().utc().toISOString(),
    });

    return Response.json({
      status: 'ok',
      message: 'Warp10 opérationnel',
      pointsLus: data.result,
    });
  } catch (error) {
    return Response.json(
      { status: 'error', message: error.message },
      { status: 500 }
    );
  }
}