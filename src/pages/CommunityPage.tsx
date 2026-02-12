import { useState, useCallback } from "react";
import { useCommunityQueries } from "../hooks/useCommunityQueries";
import { useCommunityMutations } from "../hooks/useCommunityMutations";
import {
  TodoFinder,
  FeedCard,
  NotificationPanel,
  ReportModal,
} from "../components/community";
import TodoEditModal from "../components/Modals/TodoEditModal";
import type { SelectedTodoData } from "../components/community";

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState<"recent" | "friends" | "activity">(
    "recent"
  );
  const [selectedTodoData, setSelectedTodoData] = useState<SelectedTodoData | null>(null);

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
    showNotificationModal,
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

  // ===== Handlers =====
  const handleLike = (postId: number, isLiked: boolean) => {
    likeMutation.mutate({ postId, isLiked });
  };

  const handleCommentLike = (
    commentId: number,
    isLiked: boolean,
    postId: number
  ) => {
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
  const handleOpenModal = (data: SelectedTodoData) => {
    setSelectedTodoData(data);
  };

  // 모달 닫기
  const handleCloseModal = () => {
    setSelectedTodoData(null);
  };

  // TodoEditModal의 initialData 형식으로 변환
  const todoEditInitialData = selectedTodoData ? {
    scheduleType: "TASK" as const,
    mode: "CUSTOM" as const,
    title: selectedTodoData.todo.title,
    date: new Date().toISOString().split("T")[0], // YYYY-MM-DD
    memo: selectedTodoData.todo.description,
    duration: selectedTodoData.todo.defaultDurationMin,
    repeatType: selectedTodoData.todo.repeatRule || "NONE",
    emoji: selectedTodoData.emoji,
    bgColor: selectedTodoData.bgColor,
    subSchedules: selectedTodoData.todo.subTasks.map((subTask) => ({
      subTitle: subTask,
      subColor: selectedTodoData.bgColor,
      subEmoji: selectedTodoData.emoji,
    })),
  } : null;

  // ✅ 알림 모달 열 때 GET 요청 강제(refetch)
  const handleShowNotificationModal = useCallback(() => {
    setShowNotificationModal(true);
    notificationsQuery.refetch(); // <- 모달 열릴 때마다 알림 GET 확실히 나가게
    // 디버깅(원하면 유지)
    // console.log("open notifications modal");
  }, [notificationsQuery]);

  // ✅ FRIEND_REQUEST 수락/거절 후 목록 갱신
  const handleAcceptFriend = (notificationId: number) => {
    acceptFriendMutation.mutate(notificationId, {
      onSuccess: () => {
        notificationsQuery.refetch();
      },
    });
  };

  const handleRejectFriend = (notificationId: number) => {
    rejectFriendMutation.mutate(notificationId, {
      onSuccess: () => {
        notificationsQuery.refetch();
      },
    });
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
          onSendFriendRequest={(receiverId) =>
            sendFriendRequestMutation.mutate(receiverId)
          }
          onCancelFriendRequest={(receiverId) =>
            cancelFriendRequestMutation.mutate(receiverId)
          }
          onToggleSharing={(friendId, sharing) =>
            toggleSharingMutation.mutate({ friendId, sharing })
          }
          onDeleteFriend={(friendRecordId) =>
            deleteFriendMutation.mutate(friendRecordId)
          }
          // State
          activeTab={activeTab}
          onTabChange={setActiveTab}
          friendSearchQuery={friendSearchQuery}
          onFriendSearchChange={setFriendSearchQuery}
          // ✅ Modal controls
          onShowNotificationModal={handleShowNotificationModal}
        />
      </div>

      {/* ✅ 알림 패널 */}
      <NotificationPanel
        isOpen={showNotificationModal}
        onClose={() => setShowNotificationModal(false)}
        notifications={notificationsQuery.data}
        isLoading={notificationsQuery.isLoading}
        isError={notificationsQuery.isError}
        onAcceptFriend={handleAcceptFriend}
        onRejectFriend={handleRejectFriend}
      />

      {/* 신고 확인 모달 */}
      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        onConfirm={handleReportConfirm}
      />

      {/* 일정 등록하기 모달 */}
      {selectedTodoData && (
        <TodoEditModal
          mode="CREATE"
          initialData={todoEditInitialData}
          onClose={handleCloseModal}
        />
      )}

      {/* 스크롤바 숨기기 스타일 */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </>
  );
}