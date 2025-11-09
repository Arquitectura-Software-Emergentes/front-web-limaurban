import { IncidentStatus, IncidentPriority } from './enums';

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
