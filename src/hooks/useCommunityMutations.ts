import { useMutation, useQueryClient } from "@tanstack/react-query";
import { likePost, unlikePost, createPost, reportPost, blockUserPosts } from "../api/posts";
import { createComment, likeComment, unlikeComment } from "../api/comments";
import {
  sendFriendRequest,
  cancelFriendRequest,
  toggleScheduleSharing,
  deleteFriend,
} from "../api/friends";
import { acceptFriendRequest, rejectFriendRequest } from "../api/notifications";

interface UseCommunityMutationsParams {
  friendSearchQuery: string;
  onPostCreated?: () => void;
  onReportSuccess?: () => void;
}

export function useCommunityMutations({
  friendSearchQuery,
  onPostCreated,
  onReportSuccess,
}: UseCommunityMutationsParams) {
  const queryClient = useQueryClient();

  // 좋아요 mutation
  const likeMutation = useMutation({
    mutationFn: async ({ postId, isLiked }: { postId: number; isLiked: boolean }) => {
      if (isLiked) {
        await unlikePost(postId);
      } else {
        await likePost(postId);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["myPosts"] });
    },
  });

  // 댓글 좋아요 mutation
  const commentLikeMutation = useMutation({
    mutationFn: async ({ commentId, isLiked, postId }: { commentId: number; isLiked: boolean; postId?: number }) => {
      if (isLiked) {
        await unlikeComment(commentId);
      } else {
        await likeComment(commentId);
      }
      return { postId };
    },
    onSuccess: (data) => {
      if (data?.postId) {
        queryClient.invalidateQueries({ queryKey: ["comments", data.postId] });
      } else {
        queryClient.invalidateQueries({ queryKey: ["comments"] });
      }
    },
  });

  // 피드 작성 mutation
  const createPostMutation = useMutation({
    mutationFn: (content: string) => createPost(content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["myPosts"] });
      onPostCreated?.();
    },
  });

  // 댓글 작성 mutation
  const createCommentMutation = useMutation({
    mutationFn: ({ postId, content }: { postId: number; content: string }) =>
      createComment(postId, content),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["comments", variables.postId] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  // 신고 mutation
  const reportMutation = useMutation({
    mutationFn: ({ postId, reason }: { postId: number; reason: string }) =>
      reportPost(postId, reason),
    onSuccess: () => {
      onReportSuccess?.();
    },
  });

  // 차단 mutation
  const blockMutation = useMutation({
    mutationFn: (userId: number) => blockUserPosts(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  // 친구 요청 수락 mutation
  const acceptFriendMutation = useMutation({
    mutationFn: (notificationId: number) => acceptFriendRequest(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
    },
  });

  // 친구 요청 거절 mutation
  const rejectFriendMutation = useMutation({
    mutationFn: (notificationId: number) => rejectFriendRequest(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  // 친구 요청 보내기 mutation
  const sendFriendRequestMutation = useMutation({
    mutationFn: (userId: number) => sendFriendRequest(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendSearch", friendSearchQuery] });
    },
  });

  // 친구 요청 취소 mutation
  const cancelFriendRequestMutation = useMutation({
    mutationFn: (userId: number) => cancelFriendRequest(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendSearch", friendSearchQuery] });
    },
  });

  // 일정 공유 토글 mutation
  const toggleSharingMutation = useMutation({
    mutationFn: ({ friendId, sharing }: { friendId: number; sharing: boolean }) =>
      toggleScheduleSharing(friendId, sharing),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friends"] });
    },
  });

  // 친구 삭제 mutation
  const deleteFriendMutation = useMutation({
    mutationFn: (friendRecordId: number) => deleteFriend(friendRecordId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friends"] });
    },
  });

  return {
    likeMutation,
    commentLikeMutation,
    createPostMutation,
    createCommentMutation,
    reportMutation,
    blockMutation,
    acceptFriendMutation,
    rejectFriendMutation,
    sendFriendRequestMutation,
    cancelFriendRequestMutation,
    toggleSharingMutation,
    deleteFriendMutation,
  };
}
