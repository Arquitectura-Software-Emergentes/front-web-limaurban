import { Role } from './enums';

export interface User {
  id: string;
  full_name: string;
  phone: string | null;
  avatar_url: string | null;
  role_id: string;
  metadata: Record<string, unknown>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  role?: {
    code: Role;
    description: string;
  };
}

export interface UserInsert {
  id: string;
  full_name: string;
  phone?: string | null;
  avatar_url?: string | null;
  role_id: string;
  metadata?: Record<string, unknown>;
  is_active?: boolean;
}

export interface UserUpdate {
  full_name?: string;
  phone?: string | null;
  avatar_url?: string | null;
  role_id?: string;
  metadata?: Record<string, unknown>;
  is_active?: boolean;
  updated_at?: string;
}
