export interface IncidentCategory {
  category_id: string;
  name: string;
  code: string;
  description: string | null;
  icon_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface IncidentCategoryInsert {
  name: string;
  code: string;
  description?: string | null;
  icon_url?: string | null;
  is_active?: boolean;
}

export interface IncidentCategoryUpdate {
  name?: string;
  code?: string;
  description?: string | null;
  icon_url?: string | null;
  is_active?: boolean;
  updated_at?: string;
}
