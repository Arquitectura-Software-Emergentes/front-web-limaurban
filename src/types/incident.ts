import { IncidentStatus, IncidentPriority } from './enums';
import { District } from './district';
import { IncidentCategory } from './incident-category';

export interface Comment {
  comment_id: string;
  incident_id: string;
  author_id: string;
  content: string;
  is_internal: boolean;
  created_at: string;
  updated_at: string;
  users?: {
    id: string;
    full_name: string;
    phone: string | null;
    role_id: string;
    roles?: {
      code: 'CITIZEN' | 'MUNICIPALITY_STAFF';
    };
  };
}

export interface Incident {
  incident_id: string;
  reported_by: string;
  assigned_to: string | null;
  title: string;
  description: string;
  category_id: string;
  status: IncidentStatus;
  priority: IncidentPriority;
  latitude: number;
  longitude: number;
  address_line: string | null;
  district_code: string;
  photo_url: string | null;
  is_duplicate: boolean;
  duplicate_of: string | null;
  resolved_at: string | null;
  created_at: string;
  updated_at: string;
  ai_detected_category: string | null;
  ai_confidence: number | null;
  updated_by: string | null;
  districts?: District;
  incident_categories?: IncidentCategory;
  comments?: Comment[];
  reported_by_user?: {
    id: string;
    full_name: string;
    phone: string | null;
    role_id: string;
    roles?: {
      code: 'CITIZEN' | 'MUNICIPALITY_STAFF';
    };
  } | null;
  assigned_to_user?: {
    id: string;
    full_name: string;
    phone: string | null;
    role_id: string;
    roles?: {
      code: 'CITIZEN' | 'MUNICIPALITY_STAFF';
    };
  } | null;
  updated_by_user?: {
    id: string;
    full_name: string;
    phone: string | null;
    role_id: string;
    roles?: {
      code: 'CITIZEN' | 'MUNICIPALITY_STAFF';
    };
  } | null;
}

export interface IncidentInsert {
  reported_by: string;
  title: string;
  description: string;
  category_id: string;
  latitude: number;
  longitude: number;
  district_code: string;
  assigned_to?: string | null;
  status?: IncidentStatus;
  priority?: IncidentPriority;
  address_line?: string | null;
  photo_url?: string | null;
  is_duplicate?: boolean;
  duplicate_of?: string | null;
}

export interface IncidentUpdate {
  assigned_to?: string | null;
  title?: string;
  description?: string;
  category_id?: string;
  status?: IncidentStatus;
  priority?: IncidentPriority;
  latitude?: number;
  longitude?: number;
  address_line?: string | null;
  district_code?: string;
  photo_url?: string | null;
  is_duplicate?: boolean;
  duplicate_of?: string | null;
  resolved_at?: string | null;
  updated_at?: string;
  updated_by?: string;
}

export interface IncidentFull extends Incident {
  reporter_name: string;
  assignee_name: string | null;
  updated_by_name: string | null;
  category_name: string;
  category_code: string;
  district_name: string;
  detection_id: string | null;
  yolo_confidence: number | null;
  bounding_box: Record<string, unknown> | null;
  model_version: string | null;
  num_detecciones: number | null;
  url_resultado: string | null;
  yolo_detected_at: string | null;
  comment_count: number;
  attachment_count: number;
}
