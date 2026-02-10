export type NotificationType =
  | 'FRIEND_REQUEST'
  | 'COMMENT'
  | 'LIKE';

export interface Notification {
  notificationId: number;
  content: string;
  type: NotificationType;
  targetId: number;
  createdAt: string;
  read: boolean;
}

export interface NotificationsResponse {
  notifications: Notification[];
}
