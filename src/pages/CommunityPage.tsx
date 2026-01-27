
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Bell, Heart, MessageCircle, MoreVertical, Plus, Calendar, Clock, Repeat, X, Pencil, Loader2 } from "lucide-react";
import todosData from "../data/todos.json";
import { getPosts, likePost, unlikePost } from "../api/posts";
import type { Post as ApiPost } from "../types/post";

interface TodoItem {
  taskId: string;
  title: string;
  description: string;
  subTasks: string[];
  defaultDurationMin: number;
  repeatRule: string;
  difficulty: number;
  tags: string[];
  template: {
    recommendedTimes: string[];
    minPerSession: number;
  };
  status: string;
}

interface Category {
  categoryKey: string;
  items: TodoItem[];
}

// 시간 포맷팅 함수
const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "방금 전";
  if (minutes < 60) return `${minutes}분 전`;
  if (hours < 24) return `${hours}시간 전`;
  if (days < 7) return `${days}일 전`;
  return date.toLocaleDateString("ko-KR");
};

// 카테고리별 이모지와 색상 매핑
const categoryEmojis: Record<string, string> = {
  "관리": "📁",
  "업무": "💼",
  "반려동물": "🐾",
  "출퇴근": "🚗",
  "학습": "📚",
  "건강": "💪",
  "취미": "🎯",
  "소설": "📖",
  "준비": "🎁"
};

const categoryColors: Record<string, string[]> = {
  "관리": ["bg-green-100", "bg-red-100", "bg-orange-100", "bg-yellow-100", "bg-purple-100"],
  "업무": ["bg-yellow-100", "bg-purple-100", "bg-green-100", "bg-blue-100", "bg-pink-100"],
  "반려동물": ["bg-yellow-100", "bg-pink-100", "bg-green-100", "bg-blue-100", "bg-purple-100"],
  "출퇴근": ["bg-blue-100", "bg-green-100", "bg-yellow-100", "bg-orange-100", "bg-red-100"],
  "학습": ["bg-indigo-100", "bg-purple-100", "bg-blue-100", "bg-green-100", "bg-yellow-100"],
  "건강": ["bg-green-100", "bg-blue-100", "bg-yellow-100", "bg-pink-100", "bg-purple-100"],
  "취미": ["bg-pink-100", "bg-purple-100", "bg-yellow-100", "bg-blue-100", "bg-green-100"],
  "소설": ["bg-purple-100", "bg-indigo-100", "bg-pink-100", "bg-blue-100", "bg-yellow-100"],
  "준비": ["bg-orange-100", "bg-yellow-100", "bg-blue-100", "bg-green-100", "bg-purple-100"]
};

const itemEmojis: Record<string, string[]> = {
  "관리": ["📧", "🏠", "💰", "📅", "💾"],
  "업무": ["🌟", "🔥", "💼", "✅", "📋"],
  "반려동물": ["🐕", "🍖", "✨", "🧹", "🎾"],
  "출퇴근": ["💳", "💼", "🎧", "🧘", "🗺️"],
  "학습": ["📖", "📝", "🗣️", "💻", "✍️"],
  "건강": ["🏋️", "💧", "🚶", "🧘", "😴"],
  "취미": ["📷", "��", "🎨", "🎵", "☕"],
  "소설": ["💡", "👤", "✍️", "💬", "📄"],
  "준비": ["✈️", "🎤", "📄", "🎁", "🛒"]
};

// 오늘 날짜 포맷팅
const getTodayDate = () => {
  const today = new Date();
  return `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`;
};

// 반복 규칙 한글 변환
const getRepeatLabel = (rule: string) => {
  const labels: Record<string, string> = {
    "DAILY": "매일",
    "WEEKLY": "매주",
    "MONTHLY": "매월",
    "NONE": "반복 없음"
  };
  return labels[rule] || "매주";
};

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState<"recent" | "friends" | "activity">("recent");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [openTodoId, setOpenTodoId] = useState<string | null>(null);
  const [modalTodo, setModalTodo] = useState<TodoItem | null>(null);

  const queryClient = useQueryClient();
  const categories = todosData.categories as Category[];

  // 피드 목록 조회
  const { data: postsData, isLoading, isError } = useQuery({
    queryKey: ["posts"],
    queryFn: () => getPosts(),
  });

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
    },
  });

  const handleLike = (postId: number, isLiked: boolean) => {
    likeMutation.mutate({ postId, isLiked });
  };

  // 모달 열기
  const handleOpenModal = (todo: TodoItem) => {
    setModalTodo(todo);
  };

  // 모달 닫기
  const handleCloseModal = () => {
    setModalTodo(null);
  };

  // 키워드 버튼 클릭 핸들러
  const handleCategoryClick = (categoryKey: string) => {
    setSelectedCategory(selectedCategory === categoryKey ? null : categoryKey);
  };

  // 카테고리 정렬 로직
  const sortedCategories = selectedCategory
    ? [
        categories.find(cat => cat.categoryKey === selectedCategory)!,
        ...categories.filter(cat => cat.categoryKey !== selectedCategory)
      ]
    : categories;

  // 할일 아이템 클릭 핸들러
  const handleTodoClick = (taskId: string) => {
    setOpenTodoId(openTodoId === taskId ? null : taskId);
  };

  return (
    <div className="min-h-screen bg-white flex justify-center">
      <div className="w-full max-w-[1440px] bg-gray-100 rounded-3xl p-6">
        <div className="flex gap-4">
          {/* Left Card - 할일 찾기 */}
          <div className="flex-[2] bg-white rounded-2xl shadow-sm border p-6 overflow-y-auto max-h-[calc(100vh-120px)]">
            {/* Header */}
            <h1 className="text-xl font-bold mb-4 text-[#0F1724]" style={{ fontFamily: 'Pretendard' }}>할일 찾기</h1>

            {/* Filter Buttons - 상단 고정 */}
            <div className="flex flex-wrap gap-2 mb-6">
              {categories.map((category) => (
                <button
                  key={category.categoryKey}
                  onClick={() => handleCategoryClick(category.categoryKey)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                    selectedCategory === category.categoryKey
                      ? "bg-blue-100 text-blue-700"
                      : "border border-gray-200 hover:bg-gray-50 text-[#0F1724]"
                  }`}
                  style={{ fontFamily: 'Pretendard', fontSize: '14px', fontWeight: 500 }}
                >
                  {categoryEmojis[category.categoryKey]} {category.categoryKey}
                </button>
              ))}
            </div>

            {/* Category Sections */}
            {sortedCategories.map((category, categoryIndex) => (
              <div key={category.categoryKey} className={categoryIndex > 0 ? "mt-6" : ""}>
                {/* 카테고리 키워드 - 왼쪽 상단 */}
                <h2
                  className="text-base font-semibold mb-3 text-[#0F1724]"
                  style={{ fontFamily: 'Pretendard' }}
                >
                  {category.categoryKey}
                </h2>

                <div className="space-y-2">
                  {category.items.map((todo, index) => {
                    const isOpen = openTodoId === todo.taskId;
                    const colors = categoryColors[category.categoryKey] || categoryColors["관리"];
                    const emojis = itemEmojis[category.categoryKey] || itemEmojis["관리"];
                    const color = colors[index % colors.length];
                    const emoji = emojis[index % emojis.length];

                    return (
                      <div
                        key={todo.taskId}
                        className={`bg-white rounded-xl transition overflow-hidden ${
                          isOpen ? "border-2 border-blue-300 shadow-sm" : "border border-gray-200 hover:shadow-sm"
                        }`}
                      >
                        {/* Todo Header */}
                        <div
                          className="flex items-center justify-between px-4 py-3 cursor-pointer"
                          onClick={() => handleTodoClick(todo.taskId)}
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <div
                              className={`w-9 h-9 ${color} rounded-lg flex items-center justify-center text-base flex-shrink-0`}
                            >
                              {emoji}
                            </div>
                            <p
                              className="text-[#0F1724] font-medium"
                              style={{ fontFamily: 'Pretendard', fontSize: '15px' }}
                            >
                              {todo.title}
                            </p>
                          </div>
                          {isOpen ? (
                            <button
                              onClick={(e) => { e.stopPropagation(); handleOpenModal(todo); }}
                              className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition flex items-center gap-1.5"
                              style={{ fontFamily: 'Pretendard' }}
                            >
                              <Plus className="w-4 h-4" />
                              내 할일에 추가하기
                            </button>
                          ) : (
                            <span
                              className="text-blue-500"
                              style={{ fontFamily: 'Pretendard', fontSize: '12px', fontWeight: 500 }}
                            >
                              {Math.floor(Math.random() * 3000) + 500}명이 활용했어요.
                            </span>
                          )}
                        </div>

                        {/* Todo Detail - 토글로 표시 */}
                        {isOpen && (
                          <div className="px-4 pb-4">
                            <div className="bg-blue-50/50 rounded-xl border border-blue-200 p-5">
                              <div className="flex gap-6">
                                {/* 왼쪽: 하위작업 */}
                                <div className="flex-1">
                                  <p
                                    className="text-sm font-semibold text-[#0F1724] mb-3"
                                    style={{ fontFamily: 'Pretendard' }}
                                  >
                                    하위 작업
                                  </p>
                                  {todo.subTasks && todo.subTasks.length > 0 && (
                                    <div className="space-y-2">
                                      {todo.subTasks.map((subTask, subIndex) => (
                                        <div
                                          key={subIndex}
                                          className="flex gap-3 items-start bg-white rounded-lg px-4 py-3"
                                        >
                                          <div className="w-6 h-6 bg-purple-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <span className="text-purple-600 text-xs">📋</span>
                                          </div>
                                          <p
                                            className="text-[#0F1724] flex-1"
                                            style={{ fontFamily: 'Pretendard', fontSize: '14px', fontWeight: 400, lineHeight: '1.5' }}
                                          >
                                            {subTask}
                                          </p>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>

                                {/* 오른쪽: 키워드, 설명, 날짜, 소요시간, 반복 */}
                                <div className="w-72 bg-white rounded-xl p-5 border border-gray-100">
                                  {/* 상단: 키워드 + 드롭다운 */}
                                  <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-200">
                                      <span className="text-base">📁</span>
                                      <span
                                        className="text-[#0F1724] font-medium"
                                        style={{ fontFamily: 'Pretendard', fontSize: '14px' }}
                                      >
                                        {category.categoryKey}
                                      </span>
                                    </div>
                                    <select
                                      className="text-sm text-gray-500 border border-gray-200 rounded-lg px-3 py-1.5 bg-white"
                                      style={{ fontFamily: 'Pretendard' }}
                                    >
                                      <option>사용자 지정</option>
                                    </select>
                                  </div>

                                  {/* 키워드 설명 */}
                                  <p
                                    className="text-gray-600 text-sm mb-5 leading-relaxed"
                                    style={{ fontFamily: 'Pretendard' }}
                                  >
                                    {todo.description}
                                  </p>

                                  {/* 날짜, 소요시간, 반복 */}
                                  <div className="space-y-3 pt-4 border-t border-gray-100">
                                    <div className="flex items-center justify-between">
                                      <span
                                        className="text-gray-500 text-sm"
                                        style={{ fontFamily: 'Pretendard' }}
                                      >
                                        날짜
                                      </span>
                                      <div className="flex items-center gap-1.5 text-[#0F1724]">
                                        <Calendar className="w-4 h-4" />
                                        <span style={{ fontFamily: 'Pretendard', fontSize: '14px' }}>
                                          {getTodayDate()}
                                        </span>
                                      </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                      <span
                                        className="text-gray-500 text-sm"
                                        style={{ fontFamily: 'Pretendard' }}
                                      >
                                        소요 시간
                                      </span>
                                      <div className="flex items-center gap-1.5 text-[#0F1724]">
                                        <Clock className="w-4 h-4" />
                                        <span style={{ fontFamily: 'Pretendard', fontSize: '14px' }}>
                                          {todo.defaultDurationMin}분
                                        </span>
                                      </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                      <span
                                        className="text-gray-500 text-sm"
                                        style={{ fontFamily: 'Pretendard' }}
                                      >
                                        반복
                                      </span>
                                      <div className="flex items-center gap-1.5 text-[#0F1724]">
                                        <Repeat className="w-4 h-4" />
                                        <span style={{ fontFamily: 'Pretendard', fontSize: '14px' }}>
                                          {getRepeatLabel(todo.repeatRule)}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Right Card - 오늘 피드 */}
          <div className="w-[420px] flex-shrink-0 bg-white rounded-2xl shadow-sm border overflow-hidden max-h-[calc(100vh-120px)] flex flex-col">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
              <div className="flex items-center justify-between p-5">
                <div>
                  <h2
                    className="text-xl font-bold text-[#0F1724]"
                    style={{ fontFamily: 'Pretendard' }}
                  >
                    오늘
                  </h2>
                  <p
                    className="text-xl font-bold text-[#0F1724]"
                    style={{ fontFamily: 'Pretendard' }}
                  >
                    피드
                  </p>
                </div>
                <Bell className="w-5 h-5 text-gray-400" />
              </div>

              {/* Tabs */}
              <div className="flex gap-6 px-5">
                <button
                  onClick={() => setActiveTab("recent")}
                  className={`pb-3 text-sm font-medium ${
                    activeTab === "recent"
                      ? "border-b-2 border-blue-500 text-blue-500"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                  style={{ fontFamily: 'Pretendard' }}
                >
                  최신
                </button>
                <button
                  onClick={() => setActiveTab("friends")}
                  className={`pb-3 text-sm font-medium ${
                    activeTab === "friends"
                      ? "border-b-2 border-blue-500 text-blue-500"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                  style={{ fontFamily: 'Pretendard' }}
                >
                  친구 관리
                </button>
                <button
                  onClick={() => setActiveTab("activity")}
                  className={`pb-3 text-sm font-medium ${
                    activeTab === "activity"
                      ? "border-b-2 border-blue-500 text-blue-500"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                  style={{ fontFamily: 'Pretendard' }}
                >
                  내 활동
                </button>
              </div>
            </div>

            {/* Posts */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
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
                    className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition"
                  >
                    {/* Post Header */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {post.author.profileImage ? (
                          <img
                            src={post.author.profileImage}
                            alt={post.author.nickname}
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
                            {post.author.nickname}
                          </p>
                          <p
                            className="text-xs text-gray-400"
                            style={{ fontFamily: 'Pretendard' }}
                          >
                            {formatTime(post.createdAt)}
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
                        onClick={() => handleLike(post.postId, post.isLiked)}
                        className={`flex items-center gap-1 ${
                          post.isLiked ? "text-red-500" : "text-gray-400 hover:text-red-500"
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

            {/* 글쓰기 버튼 */}
            <div className="p-4 border-t border-gray-100">
              <button className="w-full py-3 bg-blue-500 text-white rounded-xl text-sm font-medium hover:bg-blue-600 transition flex items-center justify-center gap-2">
                <span className="text-lg">✏️</span>
                글쓰기
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 일정 등록하기 모달 */}
      {modalTodo && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-[580px] max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 모달 헤더 */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <h2
                className="text-xl font-bold text-[#0F1724]"
                style={{ fontFamily: 'Pretendard' }}
              >
                일정 등록하기
              </h2>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
                <button
                  className="px-5 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition"
                  style={{ fontFamily: 'Pretendard' }}
                >
                  등록하기
                </button>
              </div>
            </div>

            {/* 모달 내용 */}
            <div className="px-6 py-5 overflow-y-auto max-h-[calc(90vh-80px)]">
              {/* 할일 제목 */}
              <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3 mb-4">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-sm">📋</span>
                </div>
                <input
                  type="text"
                  defaultValue={modalTodo.title}
                  className="flex-1 bg-transparent text-[#0F1724] font-medium outline-none"
                  style={{ fontFamily: 'Pretendard', fontSize: '15px' }}
                />
              </div>

              {/* 언제든지 드롭다운 */}
              <div className="flex justify-end mb-4">
                <select
                  className="text-sm text-gray-500 border border-gray-200 rounded-lg px-3 py-2 bg-white"
                  style={{ fontFamily: 'Pretendard' }}
                >
                  <option>언제든지</option>
                  <option>오늘</option>
                  <option>내일</option>
                  <option>이번 주</option>
                </select>
              </div>

              {/* 소요 시간 */}
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <span
                  className="text-[#0F1724] font-medium"
                  style={{ fontFamily: 'Pretendard', fontSize: '14px' }}
                >
                  소요 시간
                </span>
                <div className="flex items-center gap-1.5 text-[#0F1724]">
                  <Clock className="w-4 h-4" />
                  <span style={{ fontFamily: 'Pretendard', fontSize: '14px' }}>
                    {modalTodo.defaultDurationMin}분
                  </span>
                </div>
              </div>

              {/* 하위 작업 */}
              <div className="mt-5">
                <div className="flex items-center justify-between mb-3">
                  <span
                    className="text-[#0F1724] font-medium"
                    style={{ fontFamily: 'Pretendard', fontSize: '14px' }}
                  >
                    하위 작업
                  </span>
                  <button
                    className="flex items-center gap-1.5 text-gray-500 text-sm border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50"
                    style={{ fontFamily: 'Pretendard' }}
                  >
                    하위 항목 제안 받기
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-2">
                  {modalTodo.subTasks.map((subTask, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3"
                    >
                      <div className="w-7 h-7 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-xs">📋</span>
                      </div>
                      <span
                        className="text-[#0F1724] flex-1"
                        style={{ fontFamily: 'Pretendard', fontSize: '14px' }}
                      >
                        {subTask}
                      </span>
                    </div>
                  ))}
                </div>

                {/* 새로 추가 버튼 */}
                <button
                  className="w-full mt-3 py-3 bg-blue-50 text-blue-500 rounded-xl text-sm font-medium hover:bg-blue-100 transition"
                  style={{ fontFamily: 'Pretendard' }}
                >
                  새로 추가 +
                </button>
              </div>

              {/* 메모 */}
              <div className="mt-6 pt-5 border-t border-gray-100">
                <span
                  className="text-[#0F1724] font-medium block mb-3"
                  style={{ fontFamily: 'Pretendard', fontSize: '14px' }}
                >
                  메모
                </span>
                <p
                  className="text-gray-500 text-sm leading-relaxed"
                  style={{ fontFamily: 'Pretendard' }}
                >
                  {modalTodo.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
