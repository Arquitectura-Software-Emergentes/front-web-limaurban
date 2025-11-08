// Coordenadas aproximadas de distritos de Lima, Perú
// Lat/Lng basadas en centros aproximados de cada distrito

export const districtCoordinates: Record<string, { lat: number; lng: number }> = {
  "San Isidro": { lat: -12.0931, lng: -77.0465 },
  "Miraflores": { lat: -12.1197, lng: -77.0282 },
  "San Borja": { lat: -12.0894, lng: -76.9944 },
  "La Molina": { lat: -12.0792, lng: -76.9394 },
  "Surco": { lat: -12.1478, lng: -77.0150 },
  "Santiago de Surco": { lat: -12.1478, lng: -77.0150 }, // Alias
  "San Miguel": { lat: -12.0772, lng: -77.0875 },
  "Jesús María": { lat: -12.0729, lng: -77.0458 },
  "Lince": { lat: -12.0822, lng: -77.0339 },
  "Barranco": { lat: -12.1453, lng: -77.0208 },
  "Pueblo Libre": { lat: -12.0736, lng: -77.0631 },
  "Magdalena": { lat: -12.0900, lng: -77.0751 },
  "San Luis": { lat: -12.0764, lng: -76.9978 },
  "Cercado de Lima": { lat: -12.0464, lng: -77.0428 },
  "Breña": { lat: -12.0593, lng: -77.0500 },
  "La Victoria": { lat: -12.0678, lng: -77.0192 },
  "Rímac": { lat: -12.0261, lng: -77.0442 },
  "Los Olivos": { lat: -11.9701, lng: -77.0708 },
  "San Martín de Porres": { lat: -12.0100, lng: -77.0850 },
  "Callao": { lat: -12.0566, lng: -77.1181 },
};

export function getDistrictCoordinates(distrito: string): { lat: number; lng: number } | null {
  return districtCoordinates[distrito] || null;
}
