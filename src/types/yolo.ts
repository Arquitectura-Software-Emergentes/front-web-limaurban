export interface YoloDetection {
  detection_id: string;
  incident_id: string;
  category_id: string;
  confidence: number;
  bounding_box: Record<string, unknown> | null;
  model_version: string | null;
  detected_at: string;
}

export interface YoloDetectionInsert {
  incident_id: string;
  category_id: string;
  confidence: number;
  bounding_box?: Record<string, unknown> | null;
  model_version?: string | null;
}
