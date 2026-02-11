import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X, Clock, Pencil, Plus, Loader2 } from "lucide-react";
import { postSchedule } from "../../api/event";
import type { TodoItem } from "./types";

interface TodoRegistrationModalProps {
  todo: TodoItem | null;
  onClose: () => void;
  onRegister?: () => void;
}

// 기본 이모지/배경색 (할일 카드용)
const DEFAULT_EMOJI = "📋";
const DEFAULT_BG_COLOR = "#E8E4FF";

export function TodoRegistrationModal({ todo, onClose, onRegister }: TodoRegistrationModalProps) {
  const queryClient = useQueryClient();

  // 폼 상태
  const [title, setTitle] = useState("");
  const [subTasks, setSubTasks] = useState<string[]>([]);
  const [memo, setMemo] = useState("");
  const [duration, setDuration] = useState(30);
  const [mode, setMode] = useState<"ANYTIME" | "CUSTOM">("ANYTIME");
  const [newSubTask, setNewSubTask] = useState("");
  const [showNewSubTaskInput, setShowNewSubTaskInput] = useState(false);

  // todo가 바뀔 때 상태 초기화
  useEffect(() => {
    if (todo) {
      setTitle(todo.title);
      setSubTasks(todo.subTasks);
      setMemo(todo.description);
      setDuration(todo.defaultDurationMin);
      setMode("ANYTIME");
      setNewSubTask("");
      setShowNewSubTaskInput(false);
    }
  }, [todo]);

  // 등록 mutation
  const createMutation = useMutation({
    mutationFn: postSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      queryClient.invalidateQueries({ queryKey: ["weeklyTodo"] });
      onRegister?.();
      onClose();
    },
    onError: () => {
      alert("일정 등록에 실패했습니다. 다시 시도해주세요.");
    },
  });

  if (!todo) return null;

  const handleRegister = () => {
    if (!title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }

    // SubSchedule 형식으로 변환
    const subSchedules = subTasks.map((subTask) => ({
      subTitle: subTask,
      subColor: DEFAULT_BG_COLOR,
      subEmoji: DEFAULT_EMOJI,
    }));

    if (mode === "ANYTIME") {
      createMutation.mutate({
        scheduleType: "TASK",
        mode: "ANYTIME",
        title,
        memo,
        emoji: DEFAULT_EMOJI,
        bgColor: DEFAULT_BG_COLOR,
        duration,
        subSchedules,
      });
    } else {
      // CUSTOM 모드일 경우 오늘 날짜로 등록
      const today = new Date().toISOString().split("T")[0];
      createMutation.mutate({
        scheduleType: "TASK",
        mode: "CUSTOM",
        title,
        memo,
        emoji: DEFAULT_EMOJI,
        bgColor: DEFAULT_BG_COLOR,
        duration,
        date: today,
        repeatType: "NONE",
        subSchedules,
      });
    }
  };

  const handleAddSubTask = () => {
    if (newSubTask.trim()) {
      setSubTasks([...subTasks, newSubTask.trim()]);
      setNewSubTask("");
      setShowNewSubTaskInput(false);
    }
  };

  const handleRemoveSubTask = (index: number) => {
    setSubTasks(subTasks.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={onClose}>
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
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
            <button
              onClick={handleRegister}
              disabled={createMutation.isPending}
              className="px-5 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
              style={{ fontFamily: 'Pretendard' }}
            >
              {createMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              등록하기
            </button>
          </div>
        </div>

        {/* 모달 내용 */}
        <div className="px-6 py-5 overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* 할일 제목 */}
          <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3 mb-4">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-sm">{DEFAULT_EMOJI}</span>
            </div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="할일 제목을 입력하세요"
              className="flex-1 bg-transparent text-[#0F1724] font-medium outline-none"
              style={{ fontFamily: 'Pretendard', fontSize: '15px' }}
            />
          </div>

          {/* 모드 선택 드롭다운 */}
          <div className="flex justify-end mb-4">
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value as "ANYTIME" | "CUSTOM")}
              className="text-sm text-gray-500 border border-gray-200 rounded-lg px-3 py-2 bg-white"
              style={{ fontFamily: 'Pretendard' }}
            >
              <option value="ANYTIME">언제든지</option>
              <option value="CUSTOM">오늘</option>
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
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-16 text-right border border-gray-200 rounded-lg px-2 py-1 text-sm"
                style={{ fontFamily: 'Pretendard' }}
              />
              <span style={{ fontFamily: 'Pretendard', fontSize: '14px' }}>분</span>
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
              {subTasks.map((subTask, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3 group"
                >
                  <div className="w-7 h-7 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-xs">{DEFAULT_EMOJI}</span>
                  </div>
                  <span
                    className="text-[#0F1724] flex-1"
                    style={{ fontFamily: 'Pretendard', fontSize: '14px' }}
                  >
                    {subTask}
                  </span>
                  <button
                    onClick={() => handleRemoveSubTask(index)}
                    className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* 새로 추가 입력 */}
            {showNewSubTaskInput ? (
              <div className="mt-3 flex items-center gap-2">
                <input
                  type="text"
                  value={newSubTask}
                  onChange={(e) => setNewSubTask(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddSubTask()}
                  placeholder="하위 작업을 입력하세요"
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-300"
                  style={{ fontFamily: 'Pretendard' }}
                  autoFocus
                />
                <button
                  onClick={handleAddSubTask}
                  disabled={!newSubTask.trim()}
                  className="px-4 py-3 bg-blue-500 text-white rounded-xl text-sm hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  style={{ fontFamily: 'Pretendard' }}
                >
                  추가
                </button>
                <button
                  onClick={() => {
                    setShowNewSubTaskInput(false);
                    setNewSubTask("");
                  }}
                  className="px-4 py-3 border border-gray-200 text-gray-500 rounded-xl text-sm hover:bg-gray-50"
                  style={{ fontFamily: 'Pretendard' }}
                >
                  취소
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowNewSubTaskInput(true)}
                className="w-full mt-3 py-3 bg-blue-50 text-blue-500 rounded-xl text-sm font-medium hover:bg-blue-100 transition flex items-center justify-center gap-1"
                style={{ fontFamily: 'Pretendard' }}
              >
                <Plus className="w-4 h-4" />
                새로 추가
              </button>
            )}
          </div>

          {/* 메모 */}
          <div className="mt-6 pt-5 border-t border-gray-100">
            <span
              className="text-[#0F1724] font-medium block mb-3"
              style={{ fontFamily: 'Pretendard', fontSize: '14px' }}
            >
              메모
            </span>
            <textarea
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="메모를 입력하세요"
              className="w-full text-gray-500 text-sm leading-relaxed bg-gray-50 rounded-xl p-4 outline-none resize-none min-h-[80px]"
              style={{ fontFamily: 'Pretendard' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
