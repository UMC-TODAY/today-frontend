
import { useState } from "react";
import { Bell, Heart, MessageCircle, MoreVertical, Plus } from "lucide-react";

interface Post {
  id: string;
  username: string;
  time: string;
  content: string;
  likes: number;
  comments: number;
  isLiked: boolean;
}

interface TodoItem {
  id: string;
  title: string;
  time: string;
  color: string;
  emoji: string;
}

const initialPosts: Post[] = [
  {
    id: "1",
    username: "마늘빵먹습니다다",
    time: "방금 전",
    content: "첫 출근이라서 20대 직장인이 알면 좋았던 것을 알려 주면 좋겠습니까?\n단순 사무실이지만 예의범절이 없어 궁금한 수 있어요? 도움이 필요합니다",
    likes: 13,
    comments: 2,
    isLiked: true,
  },
  {
    id: "2",
    username: "마늘빵먹습니다다",
    time: "1시간 전",
    content: "첫 출근이라서 20대 직장인이 알면 좋았던 것을 알려 주면 좋겠습니까?\n단순 사무실이지만 예의범절이 없어 궁금한 수 있어요? 도움이 필요합니다",
    likes: 13,
    comments: 2,
    isLiked: false,
  },
  {
    id: "3",
    username: "마늘빵먹습니다다",
    time: "2시간 전",
    content: "첫 출근이라서 20대 직장인이 알면 좋았던 것을 알려 주면 좋겠습니까?\n단순 사무실이지만 예의범절이 없어 궁금한 수 있어요? 도움이 필요합니다",
    likes: 13,
    comments: 2,
    isLiked: false,
  },
  {
    id: "4",
    username: "마늘빵먹습니다다",
    time: "3시간 전",
    content: "첫 출근이라서 20대 직장인이 알면 좋았던 것을 알려 주면 좋겠습니까?\n단순 사무실이지만 예의범절이 없어 궁금한 수 있어요? 도움이 필요합니다",
    likes: 13,
    comments: 2,
    isLiked: false,
  },
  {
    id: "5",
    username: "마늘빵먹습니다다",
    time: "4시간 전",
    content: "첫 출근이라서 20대 직장인이 알면 좋았던 것을 알려 주면 좋겠습니까?\n단순 사무실이지만 예의범절이 없어 궁금한 수 있어요? 도움이 필요합니다",
    likes: 13,
    comments: 2,
    isLiked: false,
  },
];

const managementTodos: TodoItem[] = [
  { id: "1", title: "기후관리", time: "2시간뒤 할일이에요", color: "bg-green-100", emoji: "🌱" },
  { id: "2", title: "의사에 들린 산책하기", time: "3시간뒤 할일이에요", color: "bg-red-100", emoji: "🌿" },
  { id: "3", title: "데이트 코스 구상하기", time: "4시간뒤 할일이에요", color: "bg-orange-100", emoji: "🌾" },
  { id: "4", title: "서디프 짝기", time: "7시간뒤 할일이에요", color: "bg-yellow-100", emoji: "😊" },
  { id: "5", title: "개인 미팅때 결과", time: "", color: "bg-purple-100", emoji: "🎯" },
];

const workTodos: TodoItem[] = [
  { id: "w1", title: "근태 관리", time: "5시간뒤 할일이에요", color: "bg-green-100", emoji: "🍃" },
  { id: "w2", title: "노스본 부분 변경하여하기", time: "6시간뒤 할일이에요", color: "bg-red-100", emoji: "🌻" },
  { id: "w3", title: "근무일 재택", time: "1시간뒤 할일이에요", color: "bg-orange-100", emoji: "🥕" },
  { id: "w4", title: "사업실 네트워킹", time: "1시간뒤 할일이에요", color: "bg-gray-100", emoji: "🌿" },
  { id: "w5", title: "보고서 작성", time: "1시간뒤 할일이에요", color: "bg-yellow-100", emoji: "🌾" },
];

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState<"recent" | "popular" | "activity">("recent");
  const [posts, setPosts] = useState<Post[]>(initialPosts);

  const handleLike = (postId: string) => {
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            }
          : post
      )
    );
  };

  return (
  // 1) 제일 바깥: 흰색 배경
  <div className="min-h-screen bg-white flex justify-center">
    {/* 2) 그 다음: 회색 카드 */}
    <div className="w-full max-w-[1440px] bg-gray-100 rounded-3xl p-6">
      {/* 3) 레이아웃: 좌(할일 찾기) / 우(오늘 피드) 분리 */}
      <div className="flex gap-4">
        {/* ✅ Left Card - 할일 찾기 */}
        <div className="flex-[2] bg-white rounded-2xl shadow-sm border p-4 overflow-y-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl text-left font-bold mb-2">할일 찾기</h1>
          </div>

          {/* Filter Buttons */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2 mb-3">
              <button className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium">
                📁 관리
              </button>
              <button className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">
                📅 일정
              </button>
              <button className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">
                ⭐ 업무등록
              </button>
              <button className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">
                🕐 최근일
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              <button className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">
                📍 목표
              </button>
              <button className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">
                📆 일정
              </button>
              <button className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">
                📍 위치
              </button>
              <button className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">
                🎯 취미
              </button>
              <button className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">
                💪 운동
              </button>
              <button className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">
                ⏰ 준비
              </button>
            </div>
          </div>

          {/* Management Section */}
          <div className="mb-6">
            <h2 className="text-base font-semibold mb-3">관리</h2>
            <div className="space-y-2">
              {managementTodos.map((todo) => (
                <div
                  key={todo.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 ${todo.color} rounded-full flex items-center justify-center text-sm`}
                    >
                      {todo.emoji}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{todo.title}</p>
                      {todo.time && <p className="text-xs text-blue-600">{todo.time}</p>}
                    </div>
                  </div>
                  {todo.id === "5" && (
                    <span className="flex items-center gap-1 text-xs">
                      <Plus className="w-3 h-3 text-red-500" />
                      <span className="text-red-500">내 할일에 추가하기</span>
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Work Section */}
          <div>
            <h2 className="text-base font-semibold mb-3">업무</h2>
            <div className="space-y-2">
              {workTodos.map((todo) => (
                <div
                  key={todo.id}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition"
                >
                  <div
                    className={`w-8 h-8 ${todo.color} rounded-full flex items-center justify-center text-sm`}
                  >
                    {todo.emoji}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{todo.title}</p>
                    {todo.time && <p className="text-xs text-blue-600">{todo.time}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Add Friend Section at Bottom */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-blue-200 rounded-full"></div>
              <div>
                <p className="text-sm font-medium">요즘게 빵빵이로보이드</p>
                <p className="text-xs text-gray-600">박에서는 너무 다이어리...</p>
              </div>
            </div>
            <button className="w-full mt-2 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">
              팔로우하기
            </button>
          </div>
        </div>

        {/* ✅ Right Card - 오늘 피드 */}
        <div className="flex-[1] bg-white rounded-2xl shadow-sm border p-4 overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
            <div className="flex items-center justify-between p-6">
              <div>
                <h2 className="text-2xl font-bold">오늘</h2>
                <p className="text-2xl font-bold">피드</p>
              </div>
              <Bell className="w-6 h-6 text-gray-400" />
            </div>

            {/* Tabs */}
            <div className="flex gap-8 px-6 border-b border-gray-200">
              <button
                onClick={() => setActiveTab("recent")}
                className={`pb-3 text-sm font-medium ${
                  activeTab === "recent"
                    ? "border-b-2 border-black text-black"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                최신
              </button>
              <button
                onClick={() => setActiveTab("popular")}
                className={`pb-3 text-sm font-medium ${
                  activeTab === "popular"
                    ? "border-b-2 border-black text-black"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                인기 피드
              </button>
              <button
                onClick={() => setActiveTab("activity")}
                className={`pb-3 text-sm font-medium ${
                  activeTab === "activity"
                    ? "border-b-2 border-black text-black"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                내 활동
              </button>
            </div>
          </div>

          {/* Posts */}
          <div className="p-6 space-y-4">
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-sm transition"
              >
                {/* Post Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium">{post.username}</p>
                      <p className="text-xs text-gray-500">{post.time}</p>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>

                {/* Post Content */}
                <p className="text-sm text-gray-700 mb-4 whitespace-pre-line">{post.content}</p>

                {/* Post Actions */}
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center gap-1.5 ${
                      post.isLiked ? "text-red-500" : "text-gray-500 hover:text-red-500"
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${post.isLiked ? "fill-current" : ""}`} />
                    <span className="text-sm font-medium">{post.likes}</span>
                  </button>
                  <button className="flex items-center gap-1.5 text-gray-500 hover:text-blue-500">
                    <MessageCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">{post.comments}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);
}