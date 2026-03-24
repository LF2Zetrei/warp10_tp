import { getSensorById, updateSensor, deleteSensor } from '@/lib/sensors';

// GET /api/sensors/:id
export async function GET(request, { params }) {
  const { id } = await params;
  const sensor = getSensorById(id);

  if (!sensor) {
    return Response.json({ error: 'Capteur introuvable' }, { status: 404 });
  }

  return Response.json(sensor);
}

// PUT /api/sensors/:id
export async function PUT(request, { params }) {
  const { id } = await params;
  const body = await request.json();

  const updated = updateSensor(id, body);

  if (!updated) {
    return Response.json({ error: 'Capteur introuvable' }, { status: 404 });
  }

  return Response.json(updated);
}

// DELETE /api/sensors/:id
export async function DELETE(request, { params }) {
  const { id } = await params;
  const deleted = deleteSensor(id);

  if (!deleted) {
    return Response.json({ error: 'Capteur introuvable' }, { status: 404 });
  }

  return Response.json({ message: 'Capteur supprimé' });
}