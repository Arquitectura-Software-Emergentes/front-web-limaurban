import { IncidentStatus, FileType } from './enums';

export interface IncidentStatusHistory {
  history_id: string;
  incident_id: string;
  status_from: IncidentStatus | null;
  status_to: IncidentStatus;
  changed_by: string;
  notes: string | null;
  changed_at: string;
}

export interface IncidentAssignment {
  assignment_id: string;
  incident_id: string;
  assigned_to: string;
  assigned_by: string;
  notes: string | null;
  assigned_at: string;
  completed_at: string | null;
}

export interface IncidentAttachment {
  attachment_id: string;
  incident_id: string;
  uploaded_by: string;
  file_url: string;
  file_type: FileType;
  file_size: number | null;
  mime_type: string | null;
  caption: string | null;
  is_validated_by_ai: boolean;
  ai_validation_result: Record<string, unknown> | null;
  created_at: string;
}
