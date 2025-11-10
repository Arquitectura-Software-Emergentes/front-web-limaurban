export interface RoleAssignment {
  assignment_id: string;
  user_id: string;
  role_id: string;
  granted_at: string;
  granted_by: string | null;
  updated_at: string;
}

export interface RoleAssignmentInsert {
  user_id: string;
  role_id: string;
  granted_by?: string | null;
}

export interface RoleAssignmentUpdate {
  role_id?: string;
  granted_by?: string | null;
  updated_at?: string;
}
