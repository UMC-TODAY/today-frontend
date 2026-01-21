import { useState } from "react";
import { Bell, Calendar, Clock, Repeat } from "lucide-react";

interface Task {
  id: string;
  title: string;
  category: string;
  color: string;
  isCompleted?: boolean;
  details?: TaskDetail;
}

interface TaskDetail {
  title: string;
  date: string;
  time: string;
  tags: string[];
  description: string;
  subtasks: SubTask[];
}

interface SubTask {
  id: string;
  text: string;
  completed: boolean;
}

interface Friend {
  id: string;
  task: string;
  isPublic: boolean;
}

const initialTasks: Task[] = [
  {
    id: "1",
    title: "기후관리",
    category: "3시간뒤 할일이에요",
    color: "bg-green-100",
  },
  {
    id: "2",
    title: "의사에 들린 산책하기",
    category: "3시간뒤 할일이에요",
    color: "bg-red-100",
  },
  {
    id: "3",
    title: "데이트 코스 구상하기",
    category: "3시간뒤 할일이에요",
    color: "bg-orange-100",
  },
  {
    id: "4",
    title: "서디프 짝기",
    category: "3시간뒤 할일이에요",
    color: "bg-gray-100",
  },
  {
    id: "5",
    title: "개인 미팅때 결과",
    category: "3시간뒤 할일이에요",
    color: "bg-blue-100",
    details: {
      title: "개인 미팅때 결과",
      date: "2024년 1월 27일",
      time: "19분",
      tags: ["매주"],
      description: "",
      subtasks: [
        {
          id: "s1",
          text: "미팅때 회의록 작성 후 회사 공유하라. 미팅때 중요 포인트 빼먹지 말고 정리할 것",
          completed: false,
        },
        {
          id: "s2",
          text: "자문이랑 업무 분담에 통합 및 개선방안 검토",
          completed: false,
        },
        {
          id: "s3",
          text: "자문 수정때 비용 검토 및 리스크 대응 수립",
          completed: false,
        },
        {
          id: "s4",
          text: "특정때 임금 및 객관성 보증 근거 마련때 아폴다셀",
          completed: false,
        },
        {
          id: "s5",
          text: "특정 미팅때 선량한 참가때 정리하기 확립하세요",
          completed: false,
        },
      ],
    },
  },
];

const workTasks: Task[] = [
  {
    id: "w1",
    title: "근태 관리",
    category: "4시간뒤 할일이에요",
    color: "bg-green-100",
  },
  {
    id: "w2",
    title: "노스본 부분 변경하여하기",
    category: "3시간뒤 할일이에요",
    color: "bg-red-100",
  },
  {
    id: "w3",
    title: "근무일 재택",
    category: "3시간뒤 할일이에요",
    color: "bg-orange-100",
  },
  {
    id: "w4",
    title: "사업실 네트워킹",
    category: "3시간뒤 할일이에요",
    color: "bg-gray-100",
  },
];

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState<"recent" | "friends" | "activity">(
    "friends"
  );
  const [selectedTask, setSelectedTask] = useState<Task | null>(
    initialTasks[4]
  );
  const [friends, setFriends] = useState<Friend[]>([
    { id: "1", task: "마늘빵먹습니다다", isPublic: true },
    { id: "2", task: "마늘빵먹습니다다", isPublic: true },
    { id: "3", task: "마늘빵먹습니다다", isPublic: true },
    { id: "4", task: "마늘빵먹습니다다", isPublic: true },
  ]);
  const [newFriend, setNewFriend] = useState("");

  const handleTogglePublic = (id: string) => {
    setFriends(
      friends.map((f) => (f.id === id ? { ...f, isPublic: !f.isPublic } : f))
    );
  };

  const handleDeleteFriend = (id: string) => {
    setFriends(friends.filter((f) => f.id !== id));
  };

  const handleAddFriend = () => {
    if (newFriend.trim()) {
      setFriends([
        ...friends,
        {
          id: Date.now().toString(),
          task: newFriend,
          isPublic: true,
        },
      ]);
      setNewFriend("");
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Main Content */}
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-6">할일 찾기</h1>

          {/* Filter Buttons */}
          <div className="flex gap-2 mb-4">
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
              관리
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
              일정
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
              업무를 등록
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
              최근일
            </button>
          </div>

          <div className="flex gap-2">
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
              목표
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
              일정
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
              위치
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
              취미
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
              운동
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
              준비
            </button>
          </div>
        </div>

        {/* Management Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">관리</h2>
          <div className="space-y-3">
            {initialTasks.map((task) => (
              <div
                key={task.id}
                onClick={() => setSelectedTask(task)}
                className={`flex items-center justify-between p-4 rounded-lg cursor-pointer transition-all ${
                  selectedTask?.id === task.id
                    ? "bg-blue-50 border-2 border-blue-400"
                    : "bg-white hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${task.color} rounded-full`}></div>
                  <div>
                    <p className="font-medium">{task.title}</p>
                    <p className="text-sm text-gray-500">{task.category}</p>
                  </div>
                </div>
                {task.id === "5" && (
                  <span className="px-3 py-1 bg-gray-100 text-sm rounded-full">
                    내 할일이 추가됩
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Work Section */}
        <div>
          <h2 className="text-lg font-semibold mb-4">업무</h2>
          <div className="space-y-3">
            {workTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-3 p-4 bg-white rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                <div className={`w-10 h-10 ${task.color} rounded-full`}></div>
                <div>
                  <p className="font-medium">{task.title}</p>
                  <p className="text-sm text-gray-500">{task.category}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Sidebar - Today's Feed */}
      <div className="w-96 bg-white border-l border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold">오늘</h2>
            <p className="text-xl font-bold">피드</p>
          </div>
          <Bell className="w-6 h-6 text-gray-400" />
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("recent")}
            className={`pb-2 ${
              activeTab === "recent"
                ? "border-b-2 border-black font-medium"
                : "text-gray-500"
            }`}
          >
            최신
          </button>
          <button
            onClick={() => setActiveTab("friends")}
            className={`pb-2 ${
              activeTab === "friends"
                ? "border-b-2 border-black font-medium"
                : "text-gray-500"
            }`}
          >
            친구 관리
          </button>
          <button
            onClick={() => setActiveTab("activity")}
            className={`pb-2 ${
              activeTab === "activity"
                ? "border-b-2 border-black font-medium"
                : "text-gray-500"
            }`}
          >
            내 활동
          </button>
        </div>

        {/* Add Friend Input */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="친구 프로필 이름으로 검색..."
            value={newFriend}
            onChange={(e) => setNewFriend(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddFriend()}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400"
          />
        </div>

        {/* Friends List */}
        <div className="space-y-4">
          {friends.map((friend) => (
            <div
              key={friend.id}
              className="p-4 border-2 border-blue-400 rounded-lg bg-blue-50"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                  <span className="text-sm">{friend.task}</span>
                </div>
                <button
                  onClick={() => handleDeleteFriend(friend.id)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                    />
                  </svg>
                  <span>알림 공유</span>
                </div>
                <button
                  onClick={() => handleTogglePublic(friend.id)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    friend.isPublic ? "bg-black" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      friend.isPublic ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Task Detail Modal (shown when task is selected) */}
        {selectedTask?.details && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-[500px] max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                  <span className="text-sm">
                    {selectedTask.details.title}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedTask(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{selectedTask.details.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{selectedTask.details.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Repeat className="w-4 h-4" />
                    <span>매주</span>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">메모</h3>
                  <button className="px-3 py-1 border border-gray-300 rounded text-sm">
                    메모
                  </button>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">상세 작업</h3>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">
                      항목 {selectedTask.details.subtasks.length}개
                    </span>
                    <button className="text-sm text-blue-600">
                      + 사항 추가
                    </button>
                  </div>
                  <div className="space-y-2">
                    {selectedTask.details.subtasks.map((subtask) => (
                      <div
                        key={subtask.id}
                        className="flex items-start gap-2 p-2 border border-gray-200 rounded"
                      >
                        <input
                          type="checkbox"
                          checked={subtask.completed}
                          className="mt-1"
                        />
                        <p className="text-sm">{subtask.text}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="text-sm text-gray-500">
                  <div className="flex justify-between">
                    <span>날짜</span>
                    <span>{selectedTask.details.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>소요 시간</span>
                    <span>{selectedTask.details.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>빈도</span>
                    <span>매주</span>
                  </div>
                </div>

                <div className="text-center text-sm text-gray-400">
                  세부 정보
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
