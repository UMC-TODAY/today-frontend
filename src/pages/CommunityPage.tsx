import { useState } from "react";
import { useCommunityQueries } from "../hooks/useCommunityQueries";
import { useCommunityMutations } from "../hooks/useCommunityMutations";
import {
  TodoFinder,
  FeedCard,
  NotificationPanel,
  ReportModal,
  TodoRegistrationModal,
} from "../components/community";
import type { TodoItem } from "../components/community";

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState<"recent" | "friends" | "activity">("recent");
  const [modalTodo, setModalTodo] = useState<TodoItem | null>(null);

  // Notification states
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  // Report states
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportPostId, setReportPostId] = useState<number | null>(null);

  // Friend search state
  const [friendSearchQuery, setFriendSearchQuery] = useState("");

  // Queries
  const {
    postsQuery,
    myPostsQuery,
    notificationsQuery,
    friendsQuery,
    friendSearchQuery: friendSearchResult,
  } = useCommunityQueries({
    activeTab,
    friendSearchQuery,
  });

  // Mutations
  const {
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
  } = useCommunityMutations({
    friendSearchQuery,
    onPostCreated: () => {},
    onReportSuccess: () => {
      setShowReportModal(false);
      setReportPostId(null);
    },
  });

  // Handlers
  const handleLike = (postId: number, isLiked: boolean) => {
    likeMutation.mutate({ postId, isLiked });
  };

  const handleCommentLike = (commentId: number, isLiked: boolean, postId: number) => {
    commentLikeMutation.mutate({ commentId, isLiked, postId });
  };

  const handleCreatePost = (content: string) => {
    if (content.trim().length >= 5) {
      createPostMutation.mutate(content);
    }
  };

  const handleCreateComment = (postId: number, content: string) => {
    if (content.trim()) {
      createCommentMutation.mutate({ postId, content });
    }
  };

  const handleReport = (postId: number) => {
    setReportPostId(postId);
    setShowReportModal(true);
  };

  const handleBlock = (userId: number) => {
    blockMutation.mutate(userId);
  };

  const handleReportConfirm = () => {
    if (reportPostId) {
      reportMutation.mutate({ postId: reportPostId, reason: "신고" });
    }
  };

  // 모달 열기
  const handleOpenModal = (todo: TodoItem) => {
    setModalTodo(todo);
  };

  // 모달 닫기
  const handleCloseModal = () => {
    setModalTodo(null);
  };

  return (
    <>
      <div className="flex gap-4 h-full overflow-hidden">
        {/* Left Card - 할일 찾기 */}
        <TodoFinder onOpenModal={handleOpenModal} />

        {/* Right Card - 오늘 피드 */}
        <FeedCard
          // Queries
          postsData={postsQuery.data}
          isLoading={postsQuery.isLoading}
          isError={postsQuery.isError}
          myPostsData={myPostsQuery.data}
          isMyPostsLoading={myPostsQuery.isLoading}
          friendsData={friendsQuery.data}
          isFriendsLoading={friendsQuery.isLoading}
          friendSearchData={friendSearchResult.data}
          isFriendSearchLoading={friendSearchResult.isLoading}
          notificationsData={notificationsQuery.data}
          // Mutations
          onLike={handleLike}
          onCommentLike={handleCommentLike}
          onCreatePost={handleCreatePost}
          onCreateComment={handleCreateComment}
          onReport={handleReport}
          onBlock={handleBlock}
          onSendFriendRequest={(userId) => sendFriendRequestMutation.mutate(userId)}
          onCancelFriendRequest={(userId) => cancelFriendRequestMutation.mutate(userId)}
          onToggleSharing={(friendId, sharing) => toggleSharingMutation.mutate({ friendId, sharing })}
          onDeleteFriend={(friendRecordId) => deleteFriendMutation.mutate(friendRecordId)}
          // State
          activeTab={activeTab}
          onTabChange={setActiveTab}
          friendSearchQuery={friendSearchQuery}
          onFriendSearchChange={setFriendSearchQuery}
          // Modal controls
          onShowNotificationModal={() => setShowNotificationModal(true)}
        />
      </div>

      {/* 알림 패널 */}
      <NotificationPanel
        isOpen={showNotificationModal}
        onClose={() => setShowNotificationModal(false)}
        notifications={notificationsQuery.data?.notifications}
        onAcceptFriend={(notificationId) => acceptFriendMutation.mutate(notificationId)}
        onRejectFriend={(notificationId) => rejectFriendMutation.mutate(notificationId)}
      />

      {/* 신고 확인 모달 */}
      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        onConfirm={handleReportConfirm}
      />

      {/* 일정 등록하기 모달 */}
      <TodoRegistrationModal
        todo={modalTodo}
        onClose={handleCloseModal}
      />

      {/* 스크롤바 숨기기 스타일 */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  );
}
