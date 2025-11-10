import { HeatmapPoint, CreateHeatmapRequest, HeatmapResponse } from '@/types/geospatial';

const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:3000';

export class GeospatialService {
  private static async fetchWithAuth(url: string, options: RequestInit = {}) {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
  }

  static async generateHeatmap(request: CreateHeatmapRequest): Promise<HeatmapResponse> {
    return this.fetchWithAuth(`${BACKEND_API_URL}/api/geospatial/heatmap`, {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  static async getHeatmapPoints(analysisId: string): Promise<HeatmapPoint[]> {
    return this.fetchWithAuth(`${BACKEND_API_URL}/api/geospatial/heatmap/${analysisId}/points`);
  }

  static async getLatestHeatmap(districtCode?: string): Promise<HeatmapResponse | null> {
    const params = new URLSearchParams();
    if (districtCode) params.append('district_code', districtCode);
    
    return this.fetchWithAuth(`${BACKEND_API_URL}/api/geospatial/heatmap/latest?${params}`);
  }
}
