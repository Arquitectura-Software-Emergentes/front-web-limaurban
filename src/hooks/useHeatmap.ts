'use client';

import { useState, useEffect } from 'react';
import { HeatmapPoint, HeatmapResponse } from '@/types/geospatial';
import { GeospatialService } from '@/lib/services/geospatial.service';

interface UseHeatmapOptions {
  districtCode?: string;
  autoFetch?: boolean;
}

export function useHeatmap({ districtCode, autoFetch = true }: UseHeatmapOptions = {}) {
  const [heatmapData, setHeatmapData] = useState<HeatmapResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchHeatmap() {
      try {
        setLoading(true);
        setError(null);
        const data = await GeospatialService.getLatestHeatmap(districtCode);
        setHeatmapData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error loading heatmap');
        console.error('Error fetching heatmap:', err);
      } finally {
        setLoading(false);
      }
    }

    if (autoFetch) {
      fetchHeatmap();
    }
  }, [districtCode, autoFetch]);

  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await GeospatialService.getLatestHeatmap(districtCode);
      setHeatmapData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading heatmap');
      console.error('Error fetching heatmap:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    heatmapData,
    points: heatmapData?.points || [],
    loading,
    error,
    refetch,
  };
}

export function useDummyHeatmap() {
  const [points] = useState<HeatmapPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  return {
    points,
    loading,
    error: null,
  };
}
