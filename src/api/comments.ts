import { axiosInstance } from "./core/axiosInstance";
import type { ApiResponse } from "../types/common";
import type { Comment, CommentsResponse } from "../types/comment";

// 댓글 목록 조회
export const getComments = async (postId: number): Promise<CommentsResponse> => {
  const response = await axiosInstance.get<ApiResponse<CommentsResponse>>(
    `/api/v1/posts/${postId}/comments`
  );
  return response.data.data;
};

// 댓글 작성
export const createComment = async (postId: number, content: string): Promise<Comment> => {
  const response = await axiosInstance.post<ApiResponse<Comment>>(
    `/api/v1/posts/${postId}/comments`,
    { content }
  );
  return response.data.data;
};

// 댓글 좋아요
export const likeComment = async (commentId: number): Promise<void> => {
  await axiosInstance.post<ApiResponse<null>>(
    `/api/v1/posts/comments/${commentId}/likes`
  );
};

// 댓글 좋아요 취소
export const unlikeComment = async (commentId: number): Promise<void> => {
  await axiosInstance.delete<ApiResponse<null>>(
    `/api/v1/posts/comments/${commentId}/likes`
  );
};
