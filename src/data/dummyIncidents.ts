/**
 * Data dummy de incidentes para desarrollo
 * ~100 incidentes distribuidos en distritos concurridos de Lima
 * con coordenadas lat/lng reales
 */

export interface DummyIncident {
  id: string;
  title: string;
  description: string;
  category_code: 'POTHOLE' | 'CRACK' | 'MANHOLE' | 'GARBAGE' | 'LIGHTING';
  status: 'pending' | 'in_review' | 'in_progress' | 'resolved';
  priority: 'low' | 'medium' | 'high' | 'critical';
  latitude: number;
  longitude: number;
  district_code: string;
  district_name: string;
  address_line: string;
  created_at: string;
}

// Helper para generar coordenadas aleatorias dentro de un bounding box
function randomCoord(min: number, max: number): number {
  return Number((Math.random() * (max - min) + min).toFixed(6));
}

// Helper para generar fecha aleatoria en los últimos 30 días
function randomDate(): string {
  const now = new Date();
  const daysAgo = Math.floor(Math.random() * 30);
  const date = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
  return date.toISOString();
}

// Distritos con bounding boxes reales
const districts = {
  SJLUR: {
    name: 'San Juan de Lurigancho',
    lat: { min: -12.020, max: -11.950 },
    lng: { min: -77.020, max: -76.960 },
  },
  SMPOR: {
    name: 'San Martín de Porres',
    lat: { min: -12.040, max: -11.970 },
    lng: { min: -77.110, max: -77.050 },
  },
  ATE: {
    name: 'Ate',
    lat: { min: -12.060, max: -11.990 },
    lng: { min: -76.980, max: -76.920 },
  },
  MIRAFL: {
    name: 'Miraflores',
    lat: { min: -12.140, max: -12.100 },
    lng: { min: -77.040, max: -77.010 },
  },
  SISID: {
    name: 'San Isidro',
    lat: { min: -12.110, max: -12.080 },
    lng: { min: -77.055, max: -77.025 },
  },
  SURCO: {
    name: 'Santiago de Surco',
    lat: { min: -12.170, max: -12.120 },
    lng: { min: -77.030, max: -76.990 },
  },
};

const categories = [
  { code: 'POTHOLE', name: 'Baches', weight: 0.35 },
  { code: 'CRACK', name: 'Grietas', weight: 0.25 },
  { code: 'MANHOLE', name: 'Tapa de Alcantarilla', weight: 0.15 },
  { code: 'GARBAGE', name: 'Acumulación de Basura', weight: 0.15 },
  { code: 'LIGHTING', name: 'Alumbrado Público', weight: 0.10 },
] as const;

const statuses = [
  { value: 'pending', weight: 0.40 },
  { value: 'in_review', weight: 0.20 },
  { value: 'in_progress', weight: 0.25 },
  { value: 'resolved', weight: 0.15 },
] as const;

const priorities = [
  { value: 'low', weight: 0.20 },
  { value: 'medium', weight: 0.35 },
  { value: 'high', weight: 0.30 },
  { value: 'critical', weight: 0.15 },
] as const;

// Helper para selección ponderada
function weightedRandom<T extends { weight: number }>(items: readonly T[]): T {
  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
  let random = Math.random() * totalWeight;
  
  for (const item of items) {
    random -= item.weight;
    if (random <= 0) return item;
  }
  
  return items[0];
}

// Generar data dummy
export function generateDummyIncidents(count: number = 100): DummyIncident[] {
  const incidents: DummyIncident[] = [];
  
  // Distribución: más incidentes en distritos populosos
  const districtWeights = {
    SJLUR: 25,  // San Juan de Lurigancho (más poblado)
    SMPOR: 20,  // San Martín de Porres
    ATE: 18,    // Ate
    SURCO: 15,  // Surco
    MIRAFL: 12, // Miraflores
    SISID: 10,  // San Isidro
  };
  
  for (let i = 0; i < count; i++) {
    // Seleccionar distrito ponderado
    const totalWeight = Object.values(districtWeights).reduce((sum, w) => sum + w, 0);
    let random = Math.random() * totalWeight;
    let selectedDistrict: keyof typeof districts = 'SJLUR';
    
    for (const [district, weight] of Object.entries(districtWeights)) {
      random -= weight;
      if (random <= 0) {
        selectedDistrict = district as keyof typeof districts;
        break;
      }
    }
    
    const districtInfo = districts[selectedDistrict];
    const category = weightedRandom(categories);
    const status = weightedRandom(statuses);
    const priority = weightedRandom(priorities);
    
    const lat = randomCoord(districtInfo.lat.min, districtInfo.lat.max);
    const lng = randomCoord(districtInfo.lng.min, districtInfo.lng.max);
    
    incidents.push({
      id: `dummy-${i + 1}`,
      title: `${category.name} reportado en ${districtInfo.name}`,
      description: `Incidente de tipo ${category.name} detectado por ciudadano. Requiere atención ${priority.value === 'critical' ? 'urgente' : priority.value === 'high' ? 'prioritaria' : 'normal'}.`,
      category_code: category.code as 'POTHOLE' | 'CRACK' | 'MANHOLE' | 'GARBAGE' | 'LIGHTING',
      status: status.value as 'pending' | 'in_review' | 'in_progress' | 'resolved',
      priority: priority.value as 'low' | 'medium' | 'high' | 'critical',
      latitude: lat,
      longitude: lng,
      district_code: selectedDistrict,
      district_name: districtInfo.name,
      address_line: `Av. Principal ${Math.floor(Math.random() * 3000)}, ${districtInfo.name}`,
      created_at: randomDate(),
    });
  }
  
  return incidents;
}

// Exportar data pre-generada
export const dummyIncidents = generateDummyIncidents(100);
