export interface District {
  district_code: string;
  district_name: string;
  boundary: unknown | null;
  area_km2: number | null;
  population: number | null;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface DistrictInsert {
  district_code: string;
  district_name: string;
  boundary?: unknown | null;
  area_km2?: number | null;
  population?: number | null;
  metadata?: Record<string, unknown>;
}

export interface DistrictUpdate {
  district_name?: string;
  boundary?: unknown | null;
  area_km2?: number | null;
  population?: number | null;
  metadata?: Record<string, unknown>;
  updated_at?: string;
}
