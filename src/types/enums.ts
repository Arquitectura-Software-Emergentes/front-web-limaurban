export type UserType = 'CITIZEN' | 'MUNICIPALITY_STAFF';

export type IncidentStatus = 'pending' | 'in_review' | 'in_progress' | 'resolved' | 'closed' | 'rejected';

export type IncidentPriority = 'low' | 'medium' | 'high' | 'critical';

export type AnalysisStatus = 'pending' | 'processing' | 'completed' | 'failed';

export type AnalysisType = 'heatmap' | 'cluster' | 'hotspot';

export type NotificationType = 
  | 'incident_status_change'
  | 'incident_assigned'
  | 'incident_comment'
  | 'incident_resolved'
  | 'system_announcement'
  | 'ai_validation_complete';

export type NotificationChannel = 'in_app' | 'email' | 'push' | 'websocket';
