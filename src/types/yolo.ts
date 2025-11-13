export interface YoloDetection {
  detection_id: string;
  incident_id: string;
  category_id: string;
  confidence: number;
  bounding_box: Record<string, unknown> | null;
  model_version: string | null;
  detected_at: string;
  num_detecciones: number | null;
  url_resultado: string | null;
  yolo_response_raw: Record<string, unknown> | null;
}

export interface YoloDetectionInsert {
  incident_id: string;
  category_id: string;
  confidence: number;
  bounding_box?: Record<string, unknown> | null;
  model_version?: string | null;
  num_detecciones?: number | null;
  url_resultado?: string | null;
  yolo_response_raw?: Record<string, unknown> | null;
}
