'use client';

import React, { useEffect, useState } from 'react';
import Map, { Source, Layer } from 'react-map-gl';
import type { LayerProps } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { createClient } from '@/lib/supabase/client';
import { useLoading } from '@/contexts/LoadingContext';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:3001';

interface HeatmapPoint {
  point_id: string;
  latitude: number;
  longitude: number;
  intensity: number;
  incident_count: number;
}

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

export default function HeatmapView() {
  const [geoJsonData, setGeoJsonData] = useState<GeoJSONData | null>(null);
  const [loading, setLoading] = useState(true);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [totalIncidents, setTotalIncidents] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const { hideLoader } = useLoading();

  useEffect(() => {
    async function loadHeatmapData() {
      try {
        setLoading(true);
        setError(null);

        const supabase = createClient();
        
        // Get JWT token
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.access_token) {
          setError('No hay sesión activa');
          return;
        }

        // Call backend to generate heatmap
        const endDate = new Date();
        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 11); // Last 11 months

        const response = await fetch(`${BACKEND_API_URL}/api/geospatial/heatmap`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            time_range_start: startDate.toISOString(),
            time_range_end: endDate.toISOString(),
          }),
        });

        if (!response.ok) {
          throw new Error('Error al generar mapa de calor');
        }

        const result = await response.json();
        const analysisId = result.data.analysis_id;
        
        console.log('Heatmap generated:', result.data);

        // Fetch heatmap points from Supabase
        const { data: points, error: pointsError } = await supabase
          .from('heatmap_points')
          .select('point_id, latitude, longitude, intensity, incident_count')
          .eq('analysis_id', analysisId)
          .order('intensity', { ascending: false });

        if (pointsError) throw pointsError;

        console.log(`Fetched ${points?.length || 0} heatmap points:`, points);

        // Convert to GeoJSON
        const features: GeoJSONFeature[] = (points || []).map((point: HeatmapPoint) => ({
          type: 'Feature' as const,
          properties: {
            id: point.point_id,
            intensity: point.intensity,
            incident_count: point.incident_count,
          },
          geometry: {
            type: 'Point' as const,
            coordinates: [point.longitude, point.latitude] as [number, number],
          },
        }));

        setGeoJsonData({
          type: 'FeatureCollection',
          features,
        });

        // Calculate total incidents
        const total = (points || []).reduce((sum: number, p: HeatmapPoint) => sum + p.incident_count, 0);
        setTotalIncidents(total);

        console.log('GeoJSON features generated:', features);
        console.log('First feature coordinates:', features[0]?.geometry.coordinates);

      } catch (error) {
        console.error('Error loading heatmap:', error);
        setError(error instanceof Error ? error.message : 'Error desconocido');
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
      'heatmap-weight': ['interpolate', ['linear'], ['get', 'incident_count'], 0, 0, 10, 1],
      'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 0, 1, 11, 3, 15, 5],
      'heatmap-color': [
        'interpolate',
        ['linear'],
        ['heatmap-density'],
        0,
        'rgba(0, 196, 142, 0)',
        0.2,
        '#00C48E',
        0.4,
        '#FFD700',
        0.6,
        '#FF8C00',
        0.8,
        '#FF4500',
        1,
        '#DC143C',
      ],
      'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 0, 15, 11, 40, 15, 60],
      'heatmap-opacity': 0.8,
    },
  };

  if (loading || !geoJsonData) {
    return (
      <div className="w-full h-[calc(100vh-200px)] flex items-center justify-center bg-[#132D46] rounded-lg border border-[#345473]">
        <p className="text-white">Cargando mapa de calor...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-[calc(100vh-200px)] flex items-center justify-center bg-[#132D46] rounded-lg border border-[#345473]">
        <div className="text-center">
          <p className="text-red-400 mb-2">Error al cargar mapa de calor</p>
          <p className="text-gray-400 text-sm">{error}</p>
        </div>
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
            Total de incidentes: <span className="text-[#00C48E] font-semibold">{totalIncidents}</span>
          </p>
          <p className="text-gray-400 text-xs mt-1">
            Puntos de calor: <span className="text-[#00C48E] font-semibold">{geoJsonData.features.length}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
