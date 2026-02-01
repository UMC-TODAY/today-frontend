export type NotificationType =
  | 'FRIEND_REQUEST'
  | 'COMMENT'
  | 'LIKE'
  | 'HASHTAG_COMMENT'
  | 'HASHTAG_LIKE';

export interface Notification {
  notificationId: number;
  type: NotificationType;
  senderId: number;
  senderNickname: string;
  senderProfileImageUrl?: string;
  message: string;
  postId?: number;
  commentId?: number;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationsResponse {
  notifications: Notification[];
  hasUnread: boolean;
}
