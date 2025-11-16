/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from 'react';
import Map, { Marker, Popup } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { createClient } from '@/lib/supabase/client';
import { useLoading } from '@/contexts/LoadingContext';
import { buildPhotoUrl } from '@/lib/supabase/storage';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

interface Incident {
  incident_id: string;
  description: string;
  latitude: number;
  longitude: number;
  status: string;
  category_name: string;
  category_code: string;
  district_name: string;
  photo_url: string | null;
  created_at: string;
  reporter_name: string;
  ai_detected_category: string | null;
  ai_confidence: number | null;
}

export default function MapboxMap() {
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [modalIncident, setModalIncident] = useState<Incident | null>(null);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [mapLoaded, setMapLoaded] = useState(false);
  const { hideLoader } = useLoading();

  useEffect(() => {
    async function fetchIncidents() {
      try {
        setLoading(true);
        const supabase = createClient();

        const { data, error } = await supabase
          .from('incidents')
          .select(`
            incident_id,
            description,
            latitude,
            longitude,
            status,
            photo_url,
            created_at,
            ai_detected_category,
            ai_confidence,
            category_id(name, code),
            district_code(district_name),
            reported_by(full_name)
          `)
          .order('created_at', { ascending: false });

        if (error) throw error;

        const formattedData = data?.map((incident: any) => ({
          incident_id: incident.incident_id,
          description: incident.description,
          latitude: incident.latitude,
          longitude: incident.longitude,
          status: incident.status,
          photo_url: incident.photo_url,
          created_at: incident.created_at,
          ai_detected_category: incident.ai_detected_category,
          ai_confidence: incident.ai_confidence,
          category_name: incident.category_id?.name || 'Sin categoría',
          category_code: incident.category_id?.code || 'UNKNOWN',
          district_name: incident.district_code?.district_name || 'Sin distrito',
          reporter_name: incident.reported_by?.full_name || 'Anónimo'
        })) || [];

        setIncidents(formattedData);
      } catch (error) {
        console.error('Error fetching incidents:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchIncidents();
  }, []);

  useEffect(() => {
    if (!loading && mapLoaded) {
      const timer = setTimeout(() => {
        hideLoader();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [loading, mapLoaded, hideLoader]);

  // Función para obtener color según categoría
  const getCategoryColor = (categoryCode: string): string => {
    switch (categoryCode) {
      case 'POTHOLE':
        return '#EF4444'; // Rojo - Baches
      case 'CRACK':
        return '#F59E0B'; // Naranja - Grietas
      case 'MANHOLE':
        return '#8B5CF6'; // Púrpura - Alcantarillas
      case 'GARBAGE':
        return '#10B981'; // Verde - Basura
      case 'LIGHTING':
        return '#3B82F6'; // Azul - Iluminación
      default:
        return '#6B7280'; // Gris - Otros
    }
  };

  // Función para obtener color según estado
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'pending':
      case 'in_review':
        return '#EF4444'; // Rojo
      case 'in_progress':
        return '#F59E0B'; // Naranja
      case 'resolved':
      case 'closed':
        return '#10B981'; // Verde
      case 'rejected':
        return '#6B7280'; // Gris
      default:
        return '#6B7280';
    }
  };

  const getStatusLabel = (status: string): string => {
    const labels: Record<string, string> = {
      pending: 'Pendiente',
      in_review: 'En Revisión',
      in_progress: 'En Proceso',
      resolved: 'Resuelto',
      closed: 'Cerrado',
      rejected: 'Rechazado',
    };
    return labels[status] || status;
  };

  const getConfidenceLabel = (confidence: number | null): string => {
    if (!confidence) return 'No detectado';
    const percent = Math.round(confidence * 100);
    if (percent >= 90) return `${percent}% (Alta confianza)`;
    if (percent >= 70) return `${percent}% (Confianza media)`;
    return `${percent}% (Baja confianza)`;
  };

  if (loading) {
    return (
      <div className="w-full h-[calc(100vh-200px)] flex items-center justify-center bg-[#132D46] rounded-lg border border-[#345473]">
        <p className="text-white">Cargando mapa...</p>
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
          zoom: 11
        }}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/dark-v11"
      >
        {incidents.map((incident) => (
          <Marker
            key={incident.incident_id}
            longitude={incident.longitude}
            latitude={incident.latitude}
          >
            <div
              className="cursor-pointer transition-transform hover:scale-110"
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '50% 50% 50% 0',
                transform: 'rotate(-45deg)',
                backgroundColor: getCategoryColor(incident.category_code),
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
                  {incident.category_code.charAt(0)}
                </span>
              </div>
            </div>
          </Marker>
        ))}

        {selectedIncident && (
          <Popup
            longitude={selectedIncident.longitude}
            latitude={selectedIncident.latitude}
            onClose={() => setSelectedIncident(null)}
            closeOnClick={false}
          >
            <div className="p-2 min-w-[200px] max-w-[250px]">
              <h3 className="font-bold text-sm mb-1 text-gray-900 truncate">
                {selectedIncident.category_name}
              </h3>
              <p className="text-gray-600 text-xs mb-2 line-clamp-2">{selectedIncident.description}</p>
              <button
                onClick={() => {
                  setModalIncident(selectedIncident);
                  setSelectedIncident(null);
                }}
                className="w-full bg-[#00D9A5] hover:bg-[#00C48E] text-white text-xs py-1.5 px-3 rounded transition-colors"
              >
                Ver detalles
              </button>
            </div>
          </Popup>
        )}

        {/* Modal de detalles */}
        {modalIncident && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setModalIncident(null)}
          >
            <div 
              className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
                <h2 className="font-bold text-xl text-gray-900">{modalIncident.category_name}</h2>
                <button
                  onClick={() => setModalIncident(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                >
                  ×
                </button>
              </div>

              <div className="p-6 space-y-4">
                {/* Imagen */}
                {modalIncident.photo_url && buildPhotoUrl(modalIncident.photo_url) && (
                  <div className="w-full">
                    <img 
                      src={buildPhotoUrl(modalIncident.photo_url)!} 
                      alt={modalIncident.category_name}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  </div>
                )}

                {/* Descripción */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Descripción</h3>
                  <p className="text-gray-700">{modalIncident.description}</p>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-1">Distrito</p>
                    <p className="text-sm text-gray-600">{modalIncident.district_name}</p>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-1">Estado</p>
                    <span
                      className="inline-block px-2 py-1 rounded text-white text-xs font-medium"
                      style={{ backgroundColor: getStatusColor(modalIncident.status) }}
                    >
                      {getStatusLabel(modalIncident.status)}
                    </span>
                  </div>

                  {modalIncident.ai_detected_category && (
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-1">IA Detectó</p>
                      <p className="text-sm text-gray-600">{modalIncident.ai_detected_category}</p>
                    </div>
                  )}

                  {modalIncident.ai_confidence && (
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-1">Confianza IA</p>
                      <p className="text-sm text-gray-600">{getConfidenceLabel(modalIncident.ai_confidence)}</p>
                    </div>
                  )}

                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-1">Reportado por</p>
                    <p className="text-sm text-gray-600">{modalIncident.reporter_name}</p>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-1">Fecha</p>
                    <p className="text-sm text-gray-600">
                      {new Date(modalIncident.created_at).toLocaleDateString('es-PE', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Map>
    </div>
  );
}
