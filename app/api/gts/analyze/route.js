import { execWarpScript } from '@/lib/warp10';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

const READ_TOKEN   = process.env.WARP10_READ_TOKEN;
const SENSOR_TYPES = ['temperature', 'pressure', 'atmosphere', 'power'];
const MODULES      = ['Prometheus', 'Nostromo', 'Sulaco', 'Cheyenne', 'Auriga'];

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const type  = searchParams.get('type');
  const start = searchParams.get('start');
  const end   = searchParams.get('end');

  const startTs = start ?? dayjs().utc().subtract(24, 'hour').toISOString();
  const endTs   = end   ?? dayjs().utc().toISOString();

  // Analyse status — un appel par module
  if (type === 'status') {
    const results = await Promise.all(
      MODULES.map(async (module) => {
        const warpscript = `
          [ '${READ_TOKEN}' 'station.status' { 'module' '${module}' } '${startTs}' '${endTs}' ] FETCH
          0 GET VALUES 'vals' STORE
          $vals SIZE 'total' STORE

          0 'n' STORE
          0 'w' STORE
          0 'c' STORE

          $vals
          <%
            'v' STORE
            $v 'nominal'  == <% $n 1 + 'n' STORE %> IFT
            $v 'warning'  == <% $w 1 + 'w' STORE %> IFT
            $v 'critical' == <% $c 1 + 'c' STORE %> IFT
          %> FOREACH

          $total 0 >
          <% $n 100 * $w 50 * + $total / %>
          <% 0 %>
          IFTE
          'healthScore' STORE

          {
            'module'      '${module}'
            'total'       $total
            'nominal'     $n
            'warning'     $w
            'critical'    $c
            'healthScore' $healthScore
          }
        `;

        const result = await execWarpScript(warpscript);
        return result.result?.[0] ?? null;
      })
    );

    return Response.json({
      type: 'status',
      className: 'station.status',
      range: { start: startTs, end: endTs },
      stats: results.filter(Boolean),
    });
  }

  // Analyse numérique
  if (!type || !SENSOR_TYPES.includes(type)) {
    return Response.json(
      { error: `Paramètre 'type' requis parmi : ${[...SENSOR_TYPES, 'status'].join(', ')}` },
      { status: 400 }
    );
  }

  const warpscript = `
    [ '${READ_TOKEN}' 'station.${type}' {} '${startTs}' '${endTs}' ] FETCH
    'allGts' STORE

    [] 'results' STORE

    $allGts
    <%
      'gts' STORE
      $gts VALUES LSORT 'sorted' STORE
      $sorted SIZE 'n' STORE

      [ [ $gts ] [] reducer.mean ] REDUCE
      0 GET VALUES 0 GET 'mean' STORE

      $n 0 >
      <%
        $sorted $n 2 / TOLONG GET     'median' STORE
        $sorted $n 4 / TOLONG GET     'q1'     STORE
        $sorted $n 4 / TOLONG 3 * GET 'q3'     STORE
        $sorted $n 100 / TOLONG 99 * GET 'p99' STORE
      %>
      <%
        0 'median' STORE
        0 'q1'     STORE
        0 'q3'     STORE
        0 'p99'    STORE
      %>
      IFTE

      {
        'module'  $gts LABELS 'module' GET
        'mean'    $mean
        'median'  $median
        'q1'      $q1
        'q3'      $q3
        'p99'     $p99
        'points'  $n
      }
      $results SWAP + 'results' STORE
    %> FOREACH

    $results
  `;

  const result = await execWarpScript(warpscript);
  return Response.json({
    type,
    className: `station.${type}`,
    range: { start: startTs, end: endTs },
    stats: result.result?.[0] ?? [],
  });
}
