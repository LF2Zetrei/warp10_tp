import { Warp10 } from '@senx/warp10';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

const w10 = new Warp10({
  endpoint: process.env.WARP10_URL,
  silent: true,
});

const WRITE_TOKEN = process.env.WARP10_WRITE_TOKEN;
const READ_TOKEN = process.env.WARP10_READ_TOKEN;

/* Envoies des mesures à warp10 */
export async function writeMeasures(measures) {
  const points = measures.map((mesure) => {
    let timestamp;
    if (mesure.timestamp) {
      timestamp = dayjs(mesure.timestamp).utc().valueOf() * 1000;
    } else {
      timestamp = dayjs().utc().valueOf() * 1000;
    }

    const point = {
      timestamp,
      className: mesure.className,
      labels:    mesure.labels,
      value:     mesure.value,
    };

    return point;
  });

  const result = await w10.update(WRITE_TOKEN, points);
  return result;
}

/* Lit les données d'une GTS via fetch (entre 2 dates) */
export async function readGTS({ className, labels = {}, start, end }) {
  const endDate = end ?? dayjs().utc().toISOString();
  const startDate = start ?? dayjs().utc().subtract(24, 'hour').toISOString();

  const result = await w10.fetch(
    READ_TOKEN,
    className,
    labels,
    startDate,
    endDate,
    'json'
  );

  return result;
}

/**
 * Exécute du WarpScript brut*/
export async function execWarpScript(script) {
  const result = await w10.exec(script);
  return result;
}

