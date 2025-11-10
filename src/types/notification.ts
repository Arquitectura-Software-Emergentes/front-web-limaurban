import { NotificationType, NotificationChannel } from './enums';

export interface Notification {
  notification_id: string;
  user_id: string;
  incident_id: string | null;
  notification_type: NotificationType;
  title: string;
  message: string;
  data: Record<string, unknown> | null;
  is_read: boolean;
  read_at: string | null;
  sent_via: NotificationChannel;
  created_at: string;
}

export interface NotificationInsert {
  user_id: string;
  incident_id?: string | null;
  notification_type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, unknown> | null;
  sent_via?: NotificationChannel;
}
