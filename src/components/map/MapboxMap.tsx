"use client";

import React, { useMemo } from 'react';
import Map, { Marker, Popup } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import incidentsData from '@/data/incidents.json';
import { getDistrictCoordinates } from '@/data/districtCoordinates';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

interface Incident {
  id: string;
  distrito: string;
  tipo: string;
  prioridad: string;
  estado: string;
  fecha: string;
  imagen: string;
}

interface IncidentWithCoords extends Incident {
  lat: number;
  lng: number;
}

export default function MapboxMap() {
  const [selectedIncident, setSelectedIncident] = React.useState<IncidentWithCoords | null>(null);

  // Mapear incidentes con coordenadas
  const incidentsWithCoords = useMemo(() => {
    return incidentsData.incidents
      .map((incident: Incident) => {
        const coords = getDistrictCoordinates(incident.distrito);
        if (!coords) return null;
        return {
          ...incident,
          lat: coords.lat,
          lng: coords.lng,
        };
      })
      .filter((incident): incident is IncidentWithCoords => incident !== null);
  }, []);

  // Función para obtener color según prioridad
  const getPriorityColor = (prioridad: string): string => {
    switch (prioridad) {
      case 'Alta':
        return '#EF4444'; // Rojo
      case 'Media':
        return '#F59E0B'; // Naranja
      case 'Baja':
        return '#10B981'; // Verde
      default:
        return '#6B7280'; // Gris
    }
  };

  // Función para obtener color según estado
  const getStatusColor = (estado: string): string => {
    switch (estado) {
      case 'Pendiente':
        return '#EF4444'; // Rojo
      case 'En Proceso':
        return '#F59E0B'; // Naranja
      case 'Resuelto':
        return '#10B981'; // Verde
      default:
        return '#6B7280'; // Gris
    }
  };

  return (
    <div className="w-full h-[calc(100vh-200px)] rounded-lg overflow-hidden border border-[#345473]">
      <Map
        mapboxAccessToken={MAPBOX_TOKEN}
        initialViewState={{
          longitude: -77.0428,
          latitude: -12.0464,
          zoom: 11
        }}
        style={{ width: "100%", height: "100%" }}
        mapStyle="mapbox://styles/mapbox/dark-v11"
      >
        {incidentsWithCoords.map((incident) => (
          <Marker
            key={incident.id}
            longitude={incident.lng}
            latitude={incident.lat}
          >
            <div
              className="cursor-pointer transition-transform hover:scale-110"
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '50% 50% 50% 0',
                transform: 'rotate(-45deg)',
                backgroundColor: getPriorityColor(incident.prioridad),
                border: '3px solid white',
                boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
              }}
              onClick={() => setSelectedIncident(incident)}
            >
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: 'rotate(45deg)',
                }}
              >
                <span className="text-white text-xs font-bold">
                  {incident.tipo.charAt(0)}
                </span>
              </div>
            </div>
          </Marker>
        ))}

        {selectedIncident && (
          <Popup
            longitude={selectedIncident.lng}
            latitude={selectedIncident.lat}
            onClose={() => setSelectedIncident(null)}
            closeOnClick={false}
          >
            <div className="p-3 min-w-[250px]">
              <h3 className="font-bold text-lg mb-2 text-gray-900">
                {selectedIncident.tipo} - {selectedIncident.distrito}
              </h3>
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-700">Prioridad:</span>
                  <span
                    className="px-2 py-0.5 rounded text-white text-xs font-medium"
                    style={{ backgroundColor: getPriorityColor(selectedIncident.prioridad) }}
                  >
                    {selectedIncident.prioridad}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-700">Estado:</span>
                  <span
                    className="px-2 py-0.5 rounded text-white text-xs font-medium"
                    style={{ backgroundColor: getStatusColor(selectedIncident.estado) }}
                  >
                    {selectedIncident.estado}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-700">Fecha:</span>
                  <span className="text-gray-600">{selectedIncident.fecha}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-700">ID:</span>
                  <span className="text-gray-600">#{selectedIncident.id}</span>
                </div>
              </div>
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
}
