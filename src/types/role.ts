export interface Role {
  role_id: string;
  code: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface RoleInsert {
  code: string;
  description?: string | null;
}

export interface RoleUpdate {
  code?: string;
  description?: string | null;
  updated_at?: string;
}
