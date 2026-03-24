import { getAllSensors, createSensor } from '@/lib/sensors';

// GET /api/sensors — liste tous les capteurs
export async function GET() {
  const sensors = getAllSensors();
  return Response.json(sensors);
}

// POST /api/sensors — crée un nouveau capteur
export async function POST(request) {
  const body = await request.json();
  const { name, type, module, unit } = body;

  if (!name || !type || !module || !unit) {
    return Response.json(
      { error: 'Champs requis : name, type, module, unit' },
      { status: 400 }
    );
  }

  const sensor = createSensor({ name, type, module, unit });
  return Response.json(sensor, { status: 201 });
}