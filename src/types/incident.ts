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
    user_type: 'CITIZEN' | 'MUNICIPALITY_STAFF';
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
  districts?: District;
  incident_categories?: IncidentCategory;
  comments?: Comment[];
  reported_by_user?: {
    id: string;
    full_name: string;
    phone: string | null;
    user_type: 'CITIZEN' | 'MUNICIPALITY_STAFF';
  } | null;
  assigned_to_user?: {
    id: string;
    full_name: string;
    phone: string | null;
    user_type: 'CITIZEN' | 'MUNICIPALITY_STAFF';
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
}
