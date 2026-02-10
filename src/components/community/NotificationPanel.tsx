import { X, Heart, MessageCircle, ChevronRight } from "lucide-react";
import type { Notification } from "../../types/notification";

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[] | undefined;
  onAcceptFriend: (notificationId: number) => void;
  onRejectFriend: (notificationId: number) => void;
  onNotificationClick?: (notification: Notification) => void;
}

export function NotificationPanel({
  isOpen,
  onClose,
  notifications,
  onAcceptFriend,
  onRejectFriend,
  onNotificationClick,
}: NotificationPanelProps) {
  if (!isOpen) return null;

  // createdAt 기준 내림차순 정렬 (최신이 위)
  const sortedNotifications = notifications
    ? [...notifications].sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    : [];

  // 알림 클릭 핸들러
  const handleNotificationClick = (notification: Notification) => {
    if (onNotificationClick) {
      onNotificationClick(notification);
    }

    // 타입별 동작 분기
    if (notification.type === 'COMMENT' || notification.type === 'LIKE') {
      // 게시글 상세로 이동 (targetId가 postId)
      onClose();
      // 게시글 상세 페이지로 이동하거나 모달로 열기
      // navigate(`/community/posts/${notification.targetId}`);
    }
    // FRIEND_REQUEST는 수락/거절 버튼으로 처리
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-end z-50" onClick={onClose}>
      <div
        className="bg-white shadow-xl overflow-hidden flex flex-col"
        style={{ width: '649px', height: '1006px', borderRadius: '16px', margin: '20px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h3 className="text-xl font-semibold text-[#0F1724]" style={{ fontFamily: 'Pretendard' }}>알림</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* 알림 목록 */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {sortedNotifications.length > 0 ? (
            sortedNotifications.map((notification: Notification) => (
              <div
                key={notification.notificationId}
                className={`flex items-center justify-between p-5 border border-gray-200 rounded-xl transition-colors ${
                  !notification.read ? 'bg-blue-50' : 'bg-white'
                } ${notification.type !== 'FRIEND_REQUEST' ? 'cursor-pointer hover:bg-gray-50' : ''}`}
                onClick={() => {
                  if (notification.type !== 'FRIEND_REQUEST') {
                    handleNotificationClick(notification);
                  }
                }}
              >
                <div className="flex items-center gap-4 flex-1">
                  {/* 알림 타입에 따른 아이콘 */}
                  {notification.type === 'FRIEND_REQUEST' ? (
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                      </svg>
                    </div>
                  ) : notification.type === 'COMMENT' ? (
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="w-5 h-5 text-green-500" />
                    </div>
                  ) : notification.type === 'LIKE' ? (
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Heart className="w-5 h-5 text-red-500" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 bg-gray-100 rounded-full border border-gray-200 flex-shrink-0"></div>
                  )}
                  <div className="flex-1">
                    <p className="text-sm text-[#0F1724]" style={{ fontFamily: 'Pretendard' }}>
                      {notification.content}
                    </p>
                    <p className="text-xs text-gray-400 mt-1" style={{ fontFamily: 'Pretendard' }}>
                      {notification.createdAt}
                    </p>
                  </div>
                  {/* 읽지 않은 알림 표시 */}
                  {!notification.read && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                  )}
                </div>

                {notification.type === 'FRIEND_REQUEST' ? (
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAcceptFriend(notification.notificationId);
                      }}
                      className="px-5 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600"
                      style={{ fontFamily: 'Pretendard' }}
                    >
                      수락
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRejectFriend(notification.notificationId);
                      }}
                      className="px-5 py-2 border border-gray-300 text-gray-600 text-sm rounded-lg hover:bg-gray-50"
                      style={{ fontFamily: 'Pretendard' }}
                    >
                      거절
                    </button>
                  </div>
                ) : (
                  <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0 ml-4" />
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-16 text-gray-400 text-base" style={{ fontFamily: 'Pretendard' }}>
              새로운 알림이 없습니다.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
