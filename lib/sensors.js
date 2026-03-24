import { randomUUID } from 'crypto';

const MODULES = ['Prometheus', 'Nostromo', 'Sulaco', 'Cheyenne', 'Auriga'];

const SENSOR_TYPES = [
  { type: 'temperature', className: 'station.temperature', unit: 'celsius' },
  { type: 'pressure', className: 'station.pressure', unit: 'hPa'     },
  { type: 'atmosphere', className: 'station.atmosphere', unit: 'percent' },
  { type: 'power', className: 'station.power', unit: 'kW'      },
  { type: 'status', className: 'station.status', unit: 'string'  },
];

function generateInitialSensors() {
  let result = [];

  MODULES.forEach((module) => {
    SENSOR_TYPES.map((element) => {
      const sensor = {
        id: randomUUID(),
        name: `${element.type.charAt(0).toUpperCase() + element.type.slice(1)} sensor for ${module}`,
        type: element.type,
        module,
        unit: element.unit,
        className: element.className,
        active: true,
        createdAt: new Date().toISOString(),
      }

      result.push(sensor);
    });
  });
  return result;
}

const globalStore =
  global._sensorStore ?? (global._sensorStore = generateInitialSensors());

const sensors = globalStore;

export function getAllSensors() {
  return sensors;
}

export function getSensorById(id) {
  let sensor = null;
  for (const s of sensors) {
    if(s.id === id) {
      return s
    }
  }
  return sensor
}

export function createSensor({ name, type, module, unit }) {

  const sensor = {
    id: randomUUID(),
    name,
    type,
    module,
    unit,
    className: `station.${type}`,
    active: true,
    createdAt: new Date().toISOString(),
  };

  sensors.push(sensor);
  return sensor;
}

export function updateSensor(id, fields) {
  const sensor = getSensorById(id);
  if (!sensor) return null;

  Object.assign(sensor, fields, { id });
  return sensor;
}

export function deleteSensor(id) {
  const index = sensors.findIndex((s) => s.id === id);
  if (index === -1) return false;

  sensors.splice(index, 1);
  return true;
}