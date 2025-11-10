'use client';

import React, { useEffect, useState } from 'react';
import Map, { Source, Layer } from 'react-map-gl';
import type { LayerProps } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import incidentsData from '@/data/incidents.json';
import { getDistrictCoordinates } from '@/data/districtCoordinates';
import { useLoading } from '@/contexts/LoadingContext';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
const USE_BACKEND_API = process.env.NEXT_PUBLIC_USE_BACKEND_API === 'true';

interface GeoJSONFeature {
  type: 'Feature';
  properties: {
    id: string;
    intensity: number;
    incident_count: number;
  };
  geometry: {
    type: 'Point';
    coordinates: [number, number];
  };
}

interface GeoJSONData {
  type: 'FeatureCollection';
  features: GeoJSONFeature[];
}

function generateDummyHeatmapFromIncidents(): GeoJSONData {
  const districtIncidentCount: Record<string, number> = {};
  
  incidentsData.incidents.forEach((incident) => {
    const count = districtIncidentCount[incident.distrito] || 0;
    districtIncidentCount[incident.distrito] = count + 1;
  });

  const counts = Object.values(districtIncidentCount);
  const maxCount = counts.length > 0 ? Math.max(...counts) : 1;

  const features: GeoJSONFeature[] = Object.entries(districtIncidentCount)
    .map(([distrito, count]) => {
      const coords = getDistrictCoordinates(distrito);
      if (!coords) return null;

      return {
        type: 'Feature' as const,
        properties: {
          id: distrito,
          intensity: count / maxCount,
          incident_count: count,
        },
        geometry: {
          type: 'Point' as const,
          coordinates: [coords.lng, coords.lat] as [number, number],
        },
      };
    })
    .filter((feature): feature is GeoJSONFeature => feature !== null);

  return {
    type: 'FeatureCollection',
    features,
  };
}

export default function HeatmapView() {
  const [geoJsonData, setGeoJsonData] = useState<GeoJSONData | null>(null);
  const [loading, setLoading] = useState(true);
  const [mapLoaded, setMapLoaded] = useState(false);
  const { hideLoader } = useLoading();

  useEffect(() => {
    async function loadHeatmapData() {
      try {
        setLoading(true);

        if (USE_BACKEND_API) {
          setGeoJsonData({
            type: 'FeatureCollection',
            features: [],
          });
        } else {
          // Simular un pequeño delay para que se vea la carga de datos
          await new Promise(resolve => setTimeout(resolve, 300));
          const dummyData = generateDummyHeatmapFromIncidents();
          setGeoJsonData(dummyData);
        }
      } catch (error) {
        console.error('Error loading heatmap:', error);
      } finally {
        setLoading(false);
      }
    }

    loadHeatmapData();
  }, []);

  // Ocultar el loader solo cuando el mapa Y los datos estén listos
  useEffect(() => {
    if (!loading && mapLoaded) {
      // Pequeño delay para asegurar que todo esté renderizado
      const timer = setTimeout(() => {
        hideLoader();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [loading, mapLoaded, hideLoader]);

  const heatmapLayer: LayerProps = {
    id: 'heatmap-layer',
    type: 'heatmap',
    paint: {
      'heatmap-weight': ['interpolate', ['linear'], ['get', 'incident_count'], 0, 0, 50, 1],
      'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 0, 2, 15, 5],
      'heatmap-color': [
        'interpolate',
        ['linear'],
        ['heatmap-density'],
        0,
        'rgba(0, 196, 142, 0)', // Transparente con verde de la app
        0.2,
        '#00C48E', // Verde turquesa (color principal de la app) - Baja densidad
        0.4,
        '#FFD700', // Amarillo dorado - Media
        0.6,
        '#FF8C00', // Naranja intenso - Alta
        0.8,
        '#FF4500', // Rojo anaranjado - Muy alta
        1,
        '#DC143C', // Rojo carmesí - Crítica
      ],
      'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 0, 15, 11, 40, 15, 60],
      'heatmap-opacity': ['interpolate', ['linear'], ['zoom'], 0, 0.9, 15, 0.7],
    },
  };

  if (loading || !geoJsonData) {
    return (
      <div className="w-full h-[calc(100vh-200px)] flex items-center justify-center bg-[#132D46] rounded-lg border border-[#345473]">
        <p className="text-white">Cargando mapa de calor...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-[calc(100vh-200px)] rounded-lg overflow-hidden border border-[#345473]">
      <Map
        mapboxAccessToken={MAPBOX_TOKEN}
        initialViewState={{
          longitude: -77.0428,
          latitude: -12.0464,
          zoom: 11,
        }}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/dark-v11"
        onLoad={() => setMapLoaded(true)}
      >
        <Source id="incidents" type="geojson" data={geoJsonData}>
          <Layer {...heatmapLayer} />
        </Source>
      </Map>

      <div className="absolute top-4 right-4 bg-[#132D46]/90 backdrop-blur-sm border border-[#345473] rounded-lg p-4">
        <h3 className="text-white font-semibold mb-3">Leyenda</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded shadow-lg" style={{ backgroundColor: '#00C48E' }}></div>
            <span className="text-gray-300 text-sm">Baja densidad</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded shadow-lg" style={{ backgroundColor: '#FFD700' }}></div>
            <span className="text-gray-300 text-sm">Media</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded shadow-lg" style={{ backgroundColor: '#FF8C00' }}></div>
            <span className="text-gray-300 text-sm">Alta</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded shadow-lg" style={{ backgroundColor: '#DC143C' }}></div>
            <span className="text-gray-300 text-sm">Crítica</span>
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-[#345473]">
          <p className="text-gray-400 text-xs">
            Total de incidentes: <span className="text-[#00C48E] font-semibold">{incidentsData.incidents.length}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
