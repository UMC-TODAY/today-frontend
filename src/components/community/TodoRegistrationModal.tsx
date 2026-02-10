import { X, Clock, Pencil } from "lucide-react";
import type { TodoItem } from "./types";

interface TodoRegistrationModalProps {
  todo: TodoItem | null;
  onClose: () => void;
  onRegister?: () => void;
}

export function TodoRegistrationModal({ todo, onClose, onRegister }: TodoRegistrationModalProps) {
  if (!todo) return null;

  return (
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
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
            <button
              onClick={onRegister}
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
              defaultValue={todo.title}
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
                {todo.defaultDurationMin}분
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
              {todo.subTasks.map((subTask, index) => (
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
              {todo.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
