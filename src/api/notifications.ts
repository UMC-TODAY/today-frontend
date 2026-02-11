import { axiosInstance } from "./core/axiosInstance";
import type { ApiResponse } from "../types/common";
import type { Notification } from "../types/notification";

// 알림 목록 조회 - API가 배열을 직접 반환
export const getNotifications = async (): Promise<Notification[]> => {
  const response = await axiosInstance.get<ApiResponse<Notification[]>>(
    "/api/v1/notifications"
  );
  console.log("notifications response:", response.data.data); // 디버깅용
  return response.data.data;
};

// 친구 요청 수락
export const acceptFriendRequest = async (notificationId: number): Promise<void> => {
  await axiosInstance.post<ApiResponse<null>>(
    `/api/v1/notifications/${notificationId}/accept`
  );
};

// 친구 요청 거절
export const rejectFriendRequest = async (notificationId: number): Promise<void> => {
  await axiosInstance.post<ApiResponse<null>>(
    `/api/v1/notifications/${notificationId}/reject`
  );
};

// 알림 읽음 처리
export const markNotificationAsRead = async (notificationId: number): Promise<void> => {
  await axiosInstance.patch<ApiResponse<null>>(
    `/api/v1/notifications/${notificationId}/read`
  );
};

// 모든 알림 읽음 처리
export const markAllNotificationsAsRead = async (): Promise<void> => {
  await axiosInstance.patch<ApiResponse<null>>(
    "/api/v1/notifications/read-all"
  );
};
