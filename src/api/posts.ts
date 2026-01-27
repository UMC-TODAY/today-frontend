import { axiosInstance } from "./core/axiosInstance";
import type { ApiResponse } from "../types/common";
import type { Post, PostsResponse } from "../types/post";

// 피드 목록 조회
export const getPosts = async (cursor?: number): Promise<PostsResponse> => {
  const response = await axiosInstance.get<ApiResponse<PostsResponse>>(
    "/api/v1/posts",
    {
      params: cursor ? { cursor } : undefined,
    }
  );
  return response.data.data;
};

// 피드 좋아요
export const likePost = async (postId: number): Promise<void> => {
  await axiosInstance.post<ApiResponse<null>>(`/api/v1/posts/${postId}/likes`);
};

// 피드 좋아요 취소
export const unlikePost = async (postId: number): Promise<void> => {
  await axiosInstance.delete<ApiResponse<null>>(`/api/v1/posts/${postId}/likes`);
};

// 피드 작성
export const createPost = async (content: string): Promise<Post> => {
  const response = await axiosInstance.post<ApiResponse<Post>>(
    "/api/v1/posts",
    { content }
  );
  return response.data.data;
};

// 피드 신고
export const reportPost = async (postId: number, reason: string): Promise<void> => {
  await axiosInstance.post<ApiResponse<null>>(
    `/api/v1/posts/${postId}/report`,
    { reason }
  );
};
