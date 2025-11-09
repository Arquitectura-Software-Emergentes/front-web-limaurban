import React from 'react';
import MapboxMap from '@/components/map/MapboxMap';

export default function MapsPage() {
  return (
    <div className="w-full max-w-7xl mx-auto p-8">
      <h1 className="text-2xl font-bold text-white mb-6">Mapa de Incidentes</h1>
      <div className="mb-4">
        <div className="flex gap-4 text-sm text-gray-300">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-500"></div>
            <span>Alta Prioridad</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-orange-500"></div>
            <span>Media Prioridad</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-500"></div>
            <span>Baja Prioridad</span>
          </div>
        </div>
      </div>
      <MapboxMap />
    </div>
  );
}
