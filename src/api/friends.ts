import { axiosInstance } from "./core/axiosInstance";
import type { ApiResponse } from "../types/common";
import type { FriendsResponse, FriendSearchResponse } from "../types/friend";

// 친구 목록 조회
export const getFriends = async (): Promise<FriendsResponse> => {
  const response = await axiosInstance.get<ApiResponse<FriendsResponse>>(
    "/api/v1/friends"
  );
  return response.data.data;
};

// 친구 검색
export const searchFriends = async (keyword: string): Promise<FriendSearchResponse> => {
  const response = await axiosInstance.get<ApiResponse<FriendSearchResponse>>(
    "/api/v1/friends/search/all",
    { params: { keyword } }
  );
  return response.data.data;
};

// 친구 요청 보내기
export const sendFriendRequest = async (receiverId: number): Promise<void> => {
  await axiosInstance.post<ApiResponse<null>>(
    `/api/v1/friends/request`,
    { receiverId }
  );
};

// 친구 요청 취소
export const cancelFriendRequest = async (userId: number): Promise<void> => {
  await axiosInstance.delete<ApiResponse<null>>(
    `/api/v1/friends/requests/${userId}`
  );
};

// 일정 공유 토글
export const toggleScheduleSharing = async (friendId: number, sharing: boolean): Promise<void> => {
  await axiosInstance.patch<ApiResponse<null>>(
    `/api/v1/friends/${friendId}/sharing`,
    { sharing }
  );
};

// 친구 삭제
export const deleteFriend = async (friendId: number): Promise<void> => {
  await axiosInstance.delete<ApiResponse<null>>(
    `/api/v1/friends/${friendId}`
  );
};
