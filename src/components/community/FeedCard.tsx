import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Heart, MessageCircle, MoreVertical, Pencil, ChevronLeft, Search, Send, Share2, Loader2 } from "lucide-react";
import { getComments } from "../../api/comments";
import type { Post as ApiPost } from "../../types/post";
import type { Comment } from "../../types/comment";
import type { Friend, FriendSearchResult } from "../../types/friend";
import type { Notification } from "../../types/notification";
import bell1Svg from "../../assets/icons/bell1.svg";
import bell2Svg from "../../assets/icons/bell2.svg";

interface FeedCardProps {
  // Queries
  postsData: { posts: ApiPost[] } | undefined;
  isLoading: boolean;
  isError: boolean;
  myPostsData: { posts: ApiPost[]; totalPostCount: number; totalLikeCount: number; totalCommentCount: number } | undefined;
  isMyPostsLoading: boolean;
  friendsData: { friends: Friend[] } | undefined;
  isFriendsLoading: boolean;
  friendSearchData: { friends: FriendSearchResult[]; friendCount: number } | undefined;
  isFriendSearchLoading: boolean;
  notificationsData: { notifications: Notification[] } | undefined;

  // Mutations
  onLike: (postId: number, isLiked: boolean) => void;
  onCommentLike: (commentId: number, isLiked: boolean, postId: number) => void;
  onCreatePost: (content: string) => void;
  onCreateComment: (postId: number, content: string) => void;
  onReport: (postId: number) => void;
  onBlock: (userId: number) => void;
  onSendFriendRequest: (userId: number) => void;
  onCancelFriendRequest: (userId: number) => void;
  onToggleSharing: (friendId: number, sharing: boolean) => void;
  onDeleteFriend: (friendRecordId: number) => void;

  // State
  activeTab: "recent" | "friends" | "activity";
  onTabChange: (tab: "recent" | "friends" | "activity") => void;
  friendSearchQuery: string;
  onFriendSearchChange: (query: string) => void;

  // Modal controls
  onShowNotificationModal: () => void;
}

export function FeedCard({
  postsData,
  isLoading,
  isError,
  myPostsData,
  isMyPostsLoading,
  friendsData,
  isFriendsLoading,
  friendSearchData,
  isFriendSearchLoading,
  notificationsData,
  onLike,
  onCommentLike,
  onCreatePost,
  onCreateComment,
  onReport,
  onBlock,
  onSendFriendRequest,
  onCancelFriendRequest,
  onToggleSharing,
  onDeleteFriend,
  activeTab,
  onTabChange,
  friendSearchQuery,
  onFriendSearchChange,
  onShowNotificationModal,
}: FeedCardProps) {
  const [selectedPost, setSelectedPost] = useState<ApiPost | null>(null);

  // 댓글 목록 조회 (FeedCard 내부에서 관리)
  const { data: commentsData, isLoading: isCommentsLoading } = useQuery({
    queryKey: ["comments", selectedPost?.postId],
    queryFn: () => getComments(selectedPost!.postId),
    enabled: !!selectedPost,
  });
  const [showPostModal, setShowPostModal] = useState(false);
  const [newPostContent, setNewPostContent] = useState("");
  const [newCommentContent, setNewCommentContent] = useState("");
  const [showMoreMenu, setShowMoreMenu] = useState<number | null>(null);
  const [openFriendMenu, setOpenFriendMenu] = useState<number | null>(null);

  const hasUnreadNotifications = notificationsData?.notifications?.some((n: Notification) => !n.read) ?? false;

  const handleCreatePost = () => {
    if (newPostContent.trim().length >= 5) {
      onCreatePost(newPostContent);
      setNewPostContent("");
      setShowPostModal(false);
    }
  };

  const handleCreateComment = () => {
    if (selectedPost && newCommentContent.trim()) {
      onCreateComment(selectedPost.postId, newCommentContent);
      setNewCommentContent("");
    }
  };

  const handleReport = (postId: number) => {
    onReport(postId);
    setShowMoreMenu(null);
  };

  const handleBlock = (userId: number) => {
    onBlock(userId);
    setShowMoreMenu(null);
  };

  const handleDeleteFriend = (friendRecordId: number) => {
    onDeleteFriend(friendRecordId);
    setOpenFriendMenu(null);
  };

  return (
    <div className="flex-shrink-0 bg-white rounded-2xl shadow-sm border overflow-hidden flex flex-col relative" style={{ width: '480px' }}>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 flex-shrink-0">
        {showPostModal ? (
          /* 게시글 작성 모드 헤더 */
          <div className="flex items-center justify-between p-5">
            <button onClick={() => setShowPostModal(false)} className="text-gray-500 hover:text-gray-700">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h3 className="text-base font-medium text-[#0F1724]" style={{ fontFamily: 'Pretendard' }}>게시글</h3>
            <button
              onClick={handleCreatePost}
              disabled={newPostContent.trim().length < 5}
              className="px-4 py-1.5 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
              style={{ fontFamily: 'Pretendard' }}
            >
              작성
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between p-5">
              <div>
                <h2
                  className="text-[#0F1724]"
                  style={{ fontFamily: 'Pretendard', fontSize: '24px', fontWeight: 500, lineHeight: '100%', letterSpacing: '0%' }}
                >
                  오늘
                </h2>
                <p
                  className="text-[#0F1724]"
                  style={{ fontFamily: 'Pretendard', fontSize: '24px', fontWeight: 500, lineHeight: '100%', letterSpacing: '0%' }}
                >
                  피드
                </p>
              </div>
              <button
                onClick={onShowNotificationModal}
                className="relative"
              >
                <img
                  src={hasUnreadNotifications ? bell2Svg : bell1Svg}
                  alt="알림"
                  className="w-6 h-6"
                />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex justify-between px-5">
              <button
                onClick={() => onTabChange("recent")}
                className={`flex-1 pb-3 text-sm font-medium text-center ${activeTab === "recent"
                    ? "border-b-2 border-blue-500 text-blue-500"
                    : "text-gray-400 hover:text-gray-600"
                  }`}
                style={{ fontFamily: 'Pretendard' }}
              >
                최신
              </button>
              <button
                onClick={() => onTabChange("friends")}
                className={`flex-1 pb-3 text-sm font-medium text-center ${activeTab === "friends"
                    ? "border-b-2 border-blue-500 text-blue-500"
                    : "text-gray-400 hover:text-gray-600"
                  }`}
                style={{ fontFamily: 'Pretendard' }}
              >
                친구 관리
              </button>
              <button
                onClick={() => onTabChange("activity")}
                className={`flex-1 pb-3 text-sm font-medium text-center ${activeTab === "activity"
                    ? "border-b-2 border-blue-500 text-blue-500"
                    : "text-gray-400 hover:text-gray-600"
                  }`}
                style={{ fontFamily: 'Pretendard' }}
              >
                내 활동
              </button>
            </div>
          </>
        )}
      </div>

      {/* Tab Content */}
      <div className="flex-1 min-h-0 overflow-y-auto relative">
        {/* 게시글 상세 뷰 (카드 내부) */}
        {selectedPost && !showPostModal ? (
          <div className="flex flex-col h-full">
            {/* 상세 헤더 */}
            <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100 flex-shrink-0">
              <button onClick={() => setSelectedPost(null)} className="text-gray-500 hover:text-gray-700">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-base font-medium text-[#0F1724]" style={{ fontFamily: 'Pretendard' }}>게시글</span>
            </div>

            {/* 게시글 내용 */}
            <div className="flex-1 overflow-y-auto p-5">
              {/* 원본 게시글 */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {selectedPost.author?.profileImageUrl ? (
                      <img
                        src={selectedPost.author.profileImageUrl}
                        alt={selectedPost.author?.nickname || "사용자"}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-[#0F1724]" style={{ fontFamily: 'Pretendard' }}>
                        {selectedPost.author?.nickname || "익명"}
                      </p>
                      <p className="text-gray-400" style={{ fontFamily: 'Pretendard', fontSize: '10px' }}>
                        {selectedPost.createdAt}
                      </p>
                    </div>
                  </div>
                  <div className="relative">
                    <button
                      onClick={() => setShowMoreMenu(showMoreMenu === selectedPost.postId ? null : selectedPost.postId)}
                      className="text-gray-300 hover:text-gray-500"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                    {showMoreMenu === selectedPost.postId && (
                      <div className="absolute right-0 top-6 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10">
                        <button
                          onClick={() => handleReport(selectedPost.postId)}
                          className="flex items-center justify-center text-sm text-gray-700 hover:bg-gray-50"
                          style={{ fontFamily: 'Pretendard', width: '134px', height: '42px' }}
                        >
                          신고
                        </button>
                        <button
                          onClick={() => handleBlock(selectedPost.author.id)}
                          className="flex items-center justify-center text-sm text-gray-700 hover:bg-gray-50"
                          style={{ fontFamily: 'Pretendard', width: '134px', height: '42px' }}
                        >
                          이 친구의 모든 글 차단
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <p className="text-[#0F1724] mb-3 whitespace-pre-line" style={{ fontFamily: 'Pretendard', fontSize: '14px', lineHeight: '1.6' }}>
                  {selectedPost.content}
                </p>

                <div className="flex items-center gap-4">
                  <button
                    onClick={() => onLike(selectedPost.postId, selectedPost.isLiked)}
                    className={`flex items-center gap-1 ${selectedPost.isLiked ? "text-red-500" : "text-gray-400 hover:text-red-500"}`}
                  >
                    <Heart className={`w-4 h-4 ${selectedPost.isLiked ? "fill-current" : ""}`} />
                    <span className="text-xs font-medium">{selectedPost.likeCount}</span>
                  </button>
                  <span className="flex items-center gap-1 text-gray-400">
                    <MessageCircle className="w-4 h-4" />
                    <span className="text-xs font-medium">{selectedPost.commentCount}</span>
                  </span>
                </div>
              </div>

              {/* 댓글 목록 */}
              <div className="space-y-4">
                {isCommentsLoading ? (
                  <div className="flex items-center justify-center py-6">
                    <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                  </div>
                ) : commentsData?.comments && commentsData.comments.length > 0 ? (
                  commentsData.comments.map((comment: Comment) => (
                    <div key={comment.commentId} className="border-t border-gray-100 pt-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {comment.author?.profileImageUrl ? (
                            <img
                              src={comment.author.profileImageUrl}
                              alt={comment.author?.nickname || "사용자"}
                              className="w-7 h-7 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-7 h-7 bg-gray-200 rounded-full"></div>
                          )}
                          <div>
                            <p className="text-sm font-medium text-[#0F1724]" style={{ fontFamily: 'Pretendard' }}>
                              {comment.author?.nickname || "익명"}
                            </p>
                            <p className="text-gray-400" style={{ fontFamily: 'Pretendard', fontSize: '10px' }}>
                              {comment.createdAt}
                            </p>
                          </div>
                        </div>
                        <button className="text-gray-300 hover:text-gray-500">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-[#0F1724] text-sm mb-2" style={{ fontFamily: 'Pretendard', lineHeight: '1.5' }}>
                        {comment.content}
                      </p>
                      <button
                        onClick={() => onCommentLike(comment.commentId, comment.isLiked ?? false, selectedPost!.postId)}
                        className={`flex items-center gap-1 ${comment.isLiked ? "text-red-500" : "text-gray-400 hover:text-red-500"}`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${comment.isLiked ? "fill-current" : ""}`} />
                        <span className="text-xs">{comment.likeCount}</span>
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-gray-400 text-sm" style={{ fontFamily: 'Pretendard' }}>
                    아직 댓글이 없습니다.
                  </div>
                )}
              </div>
            </div>

            {/* 댓글 입력 */}
            <div className="border-t border-gray-100 p-4 flex-shrink-0">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="댓글 작성하기"
                  value={newCommentContent}
                  onChange={(e) => setNewCommentContent(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCreateComment()}
                  className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:border-blue-300"
                  style={{ fontFamily: 'Pretendard' }}
                />
                <button
                  onClick={handleCreateComment}
                  disabled={!newCommentContent.trim()}
                  className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ) : showPostModal ? (
          /* 게시글 작성 모드 */
          <div className="p-5 h-full">
            <textarea
              placeholder="최소 5자 이상 입력해주세요. 연락처 교환 등 부적절한 글은 삭제될 수 있으며, 등록한 글은 수정과 삭제가 어려우니 참고해주세요."
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              className="w-full h-full resize-none focus:outline-none text-sm p-0"
              style={{ fontFamily: 'Pretendard', color: newPostContent ? '#0F1724' : '#9CA3AF' }}
            />
          </div>
        ) : (
          <>
            {/* 최신 탭 */}
            {activeTab === "recent" && (
              <div className="p-4 space-y-3">
                {isLoading ? (
                  <div className="flex items-center justify-center py-10">
                    <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                  </div>
                ) : isError ? (
                  <div className="text-center py-10 text-gray-500" style={{ fontFamily: 'Pretendard' }}>
                    피드를 불러오는데 실패했습니다.
                  </div>
                ) : postsData?.posts && postsData.posts.length > 0 ? (
                  postsData.posts.map((post: ApiPost) => (
                    <div
                      key={post.postId}
                      className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition cursor-pointer"
                      onClick={() => setSelectedPost(post)}
                    >
                      {/* Post Header */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {post.author?.profileImageUrl ? (
                            <img
                              src={post.author.profileImageUrl}
                              alt={post.author?.nickname || "사용자"}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                          )}
                          <div>
                            <p
                              className="text-sm font-medium text-[#0F1724]"
                              style={{ fontFamily: 'Pretendard' }}
                            >
                              {post.author?.nickname || "익명"}
                            </p>
                            <p
                              className="text-gray-400"
                              style={{ fontFamily: 'Pretendard', fontSize: '10px' }}
                            >
                              {post.createdAt}
                            </p>
                          </div>
                        </div>
                        <div className="relative">
                          <button
                            onClick={(e) => { e.stopPropagation(); setShowMoreMenu(showMoreMenu === post.postId ? null : post.postId); }}
                            className="text-gray-300 hover:text-gray-500"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                          {showMoreMenu === post.postId && (
                            <div className="absolute right-0 top-6 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10">
                              <button
                                onClick={(e) => { e.stopPropagation(); handleReport(post.postId); }}
                                className="flex items-center justify-center text-sm text-gray-700 hover:bg-gray-50"
                                style={{ fontFamily: 'Pretendard', width: '134px', height: '42px' }}
                              >
                                신고
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); handleBlock(post.author.id); }}
                                className="flex items-center justify-center text-sm text-gray-700 hover:bg-gray-50"
                                style={{ fontFamily: 'Pretendard', width: '134px', height: '42px' }}
                              >
                                이 친구의 모든 글 차단
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Post Content */}
                      <p
                        className="text-[#0F1724] mb-3 whitespace-pre-line"
                        style={{ fontFamily: 'Pretendard', fontSize: '14px', fontWeight: 400, lineHeight: '1.5' }}
                      >
                        {post.content}
                      </p>

                      {/* Post Actions */}
                      <div className="flex items-center gap-4">
                        <button
                          onClick={(e) => { e.stopPropagation(); onLike(post.postId, post.isLiked); }}
                          className={`flex items-center gap-1 ${post.isLiked ? "text-red-500" : "text-gray-400 hover:text-red-500"
                            }`}
                        >
                          <Heart className={`w-4 h-4 ${post.isLiked ? "fill-current" : ""}`} />
                          <span className="text-xs font-medium">{post.likeCount}</span>
                        </button>
                        <button className="flex items-center gap-1 text-gray-400 hover:text-blue-500">
                          <MessageCircle className="w-4 h-4" />
                          <span className="text-xs font-medium">{post.commentCount}</span>
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 text-gray-500" style={{ fontFamily: 'Pretendard' }}>
                    아직 작성된 피드가 없습니다.
                  </div>
                )}
              </div>
            )}

            {/* 친구 관리 탭 */}
            {activeTab === "friends" && (
              <div className="p-4">
                {/* 검색창 */}
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="친구 프로필 이름으로 검색..."
                    value={friendSearchQuery}
                    onChange={(e) => onFriendSearchChange(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-full text-sm focus:outline-none focus:border-blue-300"
                    style={{ fontFamily: 'Pretendard' }}
                  />
                </div>

                {/* 친구 목록 */}
                <div className="space-y-3">
                  {isFriendsLoading || isFriendSearchLoading ? (
                    <div className="flex items-center justify-center py-10">
                      <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                    </div>
                  ) : friendSearchQuery.length > 0 ? (
                    // 검색 결과
                    friendSearchData?.friends && friendSearchData.friends.length > 0 ? (
                      <>
                        {/* 검색 결과 수 표시 */}
                        <div className="text-xs text-gray-500 mb-2" style={{ fontFamily: 'Pretendard' }}>
                          검색 결과 {friendSearchData.friendCount}명
                        </div>
                        {friendSearchData.friends.map((searchFriend: FriendSearchResult) => (
                          <div
                            key={searchFriend.userId}
                            className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              {searchFriend.profileImageUrl ? (
                                <img
                                  src={searchFriend.profileImageUrl}
                                  alt={searchFriend.nickname}
                                  className="w-10 h-10 rounded-full object-cover"
                                />
                              ) : (
                                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                              )}
                              <span className="text-sm font-medium text-[#0F1724]" style={{ fontFamily: 'Pretendard' }}>
                                {searchFriend.nickname}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              {searchFriend.friendStatus === 'FRIEND' ? (
                                <div className="flex items-center gap-2">
                                  <Share2 className="w-4 h-4 text-gray-400" />
                                  <span className="text-xs text-gray-500" style={{ fontFamily: 'Pretendard' }}>일정 공유</span>
                                  <div className="w-10 h-5 bg-gray-800 rounded-full relative cursor-pointer">
                                    <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full"></div>
                                  </div>
                                </div>
                              ) : searchFriend.friendStatus === 'PENDING' ? (
                                <div className="flex items-center gap-2">
                                  <span className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg" style={{ fontFamily: 'Pretendard' }}>
                                    친구 요청 중
                                  </span>
                                  <button
                                    onClick={() => onCancelFriendRequest(searchFriend.userId)}
                                    className="px-4 py-2 border border-blue-500 text-blue-500 text-sm rounded-lg hover:bg-blue-50"
                                    style={{ fontFamily: 'Pretendard' }}
                                  >
                                    취소
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => onSendFriendRequest(searchFriend.userId)}
                                  className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600"
                                  style={{ fontFamily: 'Pretendard' }}
                                >
                                  친구 요청
                                </button>
                              )}
                              <button className="text-gray-400">
                                <MoreVertical className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </>
                    ) : (
                      // 검색 결과 없을 때
                      <div className="text-center py-10 text-gray-400 text-sm" style={{ fontFamily: 'Pretendard' }}>
                        존재하지 않는 친구입니다.
                      </div>
                    )
                  ) : (
                    // 친구 목록
                    friendsData?.friends && friendsData.friends.length > 0 ? (
                      friendsData.friends.map((friend: Friend) => (
                        <div
                          key={friend.friendRecordId}
                          className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg relative"
                        >
                          <div className="flex items-center gap-3">
                            {friend.profileImageUrl ? (
                              <img
                                src={friend.profileImageUrl}
                                alt={friend.nickname}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                            )}
                            <span className="text-sm font-medium text-[#0F1724]" style={{ fontFamily: 'Pretendard' }}>
                              {friend.nickname}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Share2 className="w-4 h-4 text-gray-400" />
                            <span className="text-xs text-gray-500" style={{ fontFamily: 'Pretendard' }}>일정 공유</span>
                            <button
                              onClick={() => onToggleSharing(friend.friendRecordId, !friend.sharingCalendar)}
                              className={`w-10 h-5 rounded-full relative transition ${friend.sharingCalendar ? 'bg-gray-800' : 'bg-gray-300'}`}
                            >
                              <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition ${friend.sharingCalendar ? 'right-0.5' : 'left-0.5'}`}></div>
                            </button>
                            <button
                              className="text-gray-400"
                              onClick={() => setOpenFriendMenu(openFriendMenu === friend.friendRecordId ? null : friend.friendRecordId)}
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>
                            {/* 친구 삭제 드롭다운 메뉴 */}
                            {openFriendMenu === friend.friendRecordId && (
                              <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                                <button
                                  onClick={() => handleDeleteFriend(friend.friendRecordId)}
                                  className="px-4 py-2 text-sm text-red-500 hover:bg-gray-50 w-full text-left whitespace-nowrap"
                                  style={{ fontFamily: 'Pretendard' }}
                                >
                                  친구 삭제
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      // 친구 없을 때
                      <div className="text-center py-10 text-gray-400 text-sm" style={{ fontFamily: 'Pretendard' }}>
                        아직 친구가 없습니다. 친구를 검색하여 추가해보세요.
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

            {/* 내 활동 탭 */}
            {activeTab === "activity" && (
              <div className="p-4 pb-20">
                {/* 통계 */}
                <div className="flex items-center gap-4 mb-4 text-sm text-gray-600" style={{ fontFamily: 'Pretendard' }}>
                  <span>게시글 <span className="font-medium text-[#0F1724]">{myPostsData?.totalPostCount ?? 0}</span></span>
                  <span>누적 반응</span>
                  <span className="flex items-center gap-1">
                    <Heart className="w-4 h-4 text-gray-400" />
                    {myPostsData?.totalLikeCount ?? 0}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4 text-gray-400" />
                    {myPostsData?.totalCommentCount ?? 0}
                  </span>
                </div>

                {/* 내 게시글 목록 */}
                <div className="space-y-3">
                  {isMyPostsLoading ? (
                    <div className="flex items-center justify-center py-10">
                      <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                    </div>
                  ) : myPostsData?.posts && myPostsData.posts.length > 0 ? (
                    myPostsData.posts.map((post: ApiPost) => (
                      <div
                        key={post.postId}
                        className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition cursor-pointer"
                        onClick={() => setSelectedPost(post)}
                      >
                        {/* Post Header */}
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {post.author?.profileImageUrl ? (
                              <img
                                src={post.author.profileImageUrl}
                                alt={post.author?.nickname || "사용자"}
                                className="w-8 h-8 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                            )}
                            <div>
                              <p
                                className="text-sm font-medium text-[#0F1724]"
                                style={{ fontFamily: 'Pretendard' }}
                              >
                                {post.author?.nickname || "익명"}
                              </p>
                              <p
                                className="text-gray-400"
                                style={{ fontFamily: 'Pretendard', fontSize: '10px' }}
                              >
                                {post.createdAt}
                              </p>
                            </div>
                          </div>
                          <button className="text-gray-300 hover:text-gray-500">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Post Content */}
                        <p
                          className="text-[#0F1724] mb-3 whitespace-pre-line"
                          style={{ fontFamily: 'Pretendard', fontSize: '14px', fontWeight: 400, lineHeight: '1.5' }}
                        >
                          {post.content}
                        </p>

                        {/* Post Actions */}
                        <div className="flex items-center gap-4">
                          <button
                            onClick={(e) => { e.stopPropagation(); onLike(post.postId, post.isLiked); }}
                            className={`flex items-center gap-1 ${post.isLiked ? "text-red-500" : "text-gray-400 hover:text-red-500"
                              }`}
                          >
                            <Heart className={`w-4 h-4 ${post.isLiked ? "fill-current" : ""}`} />
                            <span className="text-xs font-medium">{post.likeCount}</span>
                          </button>
                          <button className="flex items-center gap-1 text-gray-400 hover:text-blue-500">
                            <MessageCircle className="w-4 h-4" />
                            <span className="text-xs font-medium">{post.commentCount}</span>
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10 text-gray-500" style={{ fontFamily: 'Pretendard' }}>
                      아직 작성한 피드가 없습니다.
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* 글쓰기 버튼 - 플로팅 */}
      {!showPostModal && !selectedPost && (activeTab === "recent" || activeTab === "activity") && (
        <button
          onClick={() => setShowPostModal(true)}
          className="absolute bottom-6 right-6 bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition shadow-lg flex items-center justify-center gap-2 z-10"
          style={{ fontFamily: 'Pretendard', borderRadius: '8px', width: '134px', height: '42px' }}
        >
          <Pencil className="w-4 h-4" />
          글쓰기
        </button>
      )}
    </div>
  );
}
