'use client';

import React, { useState } from 'react';
import MapboxMap from '@/components/map/MapboxMap';
import HeatmapView from '@/components/map/HeatmapView';
import { Map, Flame } from 'lucide-react';

export default function MapsPage() {
  const [activeView, setActiveView] = useState<'geographic' | 'heatmap'>('heatmap');

  return (
    <div className="w-full max-w-7xl mx-auto p-8">
      <h1 className="text-2xl font-bold text-white mb-6">Mapa de Incidentes</h1>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveView('heatmap')}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
            activeView === 'heatmap'
              ? 'bg-[#00C48E] text-white'
              : 'bg-[#1E2736] text-gray-400 hover:bg-[#2A3441]'
          }`}
        >
          <Flame size={20} />
          Mapa de calor
        </button>
        <button
          onClick={() => setActiveView('geographic')}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
            activeView === 'geographic'
              ? 'bg-[#00C48E] text-white'
              : 'bg-[#1E2736] text-gray-400 hover:bg-[#2A3441]'
          }`}
        >
          <Map size={20} />
          Mapa geográfico
        </button>
      </div>

      {activeView === 'geographic' && (
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
      )}

      {activeView === 'heatmap' ? <HeatmapView /> : <MapboxMap />}
    </div>
  );
}
