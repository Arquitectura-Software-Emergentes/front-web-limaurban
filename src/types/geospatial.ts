import { AnalysisType, AnalysisStatus } from './enums';

export interface GeospatialAnalysis {
  analysis_id: string;
  analysis_type: AnalysisType;
  bounding_box: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
  time_range_start: string;
  time_range_end: string;
  district_code: string | null;
  requested_by: string;
  status: AnalysisStatus;
  results: Record<string, unknown> | null;
  generated_at: string | null;
  created_at: string;
}

export interface HeatmapPoint {
  point_id: string;
  analysis_id: string;
  latitude: number;
  longitude: number;
  intensity: number;
  incident_count: number;
  radius: number;
  created_at: string;
}

export interface IncidentCluster {
  cluster_id: string;
  analysis_id: string;
  cluster_label: string;
  centroid_latitude: number;
  centroid_longitude: number;
  radius: number;
  incident_count: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  district_code: string | null;
  incident_ids: string[];
  created_at: string;
}

export interface CreateHeatmapRequest {
  district_code?: string;
  time_range_start: string;
  time_range_end: string;
  bounding_box?: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
}

export interface HeatmapResponse {
  analysis_id: string;
  status: AnalysisStatus;
  points: HeatmapPoint[];
  generated_at: string;
  metadata: {
    total_points: number;
    max_intensity: number;
    min_intensity: number;
    total_incidents: number;
  };
}

export interface DistrictStatistics {
  stat_id: string;
  district_code: string;
  stat_date: string;
  total_incidents: number;
  total_analyses: number;
  total_clusters: number;
  high_priority_clusters: number;
  avg_intensity: number;
  avg_resolution_time_hours: number;
  category_breakdown: Record<string, number>;
  last_updated: string;
}
