'use client';
import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import dayjs from 'dayjs';

export default function SensorChart({ sensorId, sensorName, unit }) {
  const [data, setData]     = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sensorId) return;
    fetch(`/api/gts/read?sensorId=${sensorId}`)
      .then((r) => r.json())
      .then((res) => {
        const points = res.data?.[0]?.v ?? [];
        const formatted = points
          .map(([ts, val]) => ({
            time: dayjs(Math.floor(ts / 1000)).format('HH:mm'),
            value: typeof val === 'number' ? parseFloat(val.toFixed(2)) : val,
          }))
          .reverse();
        setData(formatted);
      })
      .finally(() => setLoading(false));
  }, [sensorId]);

  if (loading) return (
    <div style={{ padding: '24px', textAlign: 'center', color: '#1a8c1a', fontSize: '11px', letterSpacing: '2px' }}>
      // CHARGEMENT DONNÉES...
    </div>
  );

  if (!data.length) return (
    <div style={{ padding: '24px', textAlign: 'center', color: '#1a8c1a', fontSize: '11px', letterSpacing: '2px' }}>
      // AUCUNE DONNÉE DISPONIBLE
    </div>
  );

  return (
    <div style={{ width: '100%', height: 200 }}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid stroke="#0d4d0d" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="time"
            tick={{ fill: '#1a8c1a', fontSize: 9, fontFamily: 'inherit', letterSpacing: 1 }}
            tickLine={false}
            axisLine={{ stroke: '#1a8c1a' }}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fill: '#1a8c1a', fontSize: 9, fontFamily: 'inherit' }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              background: '#000',
              border: '1px solid #1a8c1a',
              borderRadius: 0,
              fontFamily: 'inherit',
              fontSize: '11px',
              color: '#33ff33',
              letterSpacing: '1px',
            }}
            labelStyle={{ color: '#1a8c1a' }}
            formatter={(val) => [`${val} ${unit}`, sensorName]}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#33ff33"
            strokeWidth={1.5}
            dot={false}
            activeDot={{ r: 4, fill: '#33ff33', stroke: '#000' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
