import { useMemo, useState } from "react";
import {
  useGetWeeklyTodo,
  useUpdateScheduleStatus,
  useDeleteSchedules,
} from "../../hooks/queries/useSchedule.ts";
import TodoEditModal from "../goalTracker/TodoEditModal.tsx";

const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
const getWeekRange = (baseDate: Date) => {
  const tempDate = new Date(baseDate);
  const day = tempDate.getDay();
  const sunday = new Date(tempDate.setDate(tempDate.getDate() - day));
  const saturday = new Date(sunday);
  saturday.setDate(sunday.getDate() + 6);
  return { from: formatDate(sunday), to: formatDate(saturday) };
};
export default function TodoList() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [hidePast, setHidePast] = useState(false);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState<any>(null);
  const { mutate: updateStatus } = useUpdateScheduleStatus();
  const { mutate: deleteSchedules } = useDeleteSchedules();
  const { from, to } = useMemo(() => getWeekRange(currentDate), [currentDate]);
  const { data: response, isLoading } = useGetWeeklyTodo({
    from,
    to,
    filter: "ALL",
    hidePast: false,
  });
  const todoList: any[] = response?.data?.todos || [];
  const handlePrevWeek = () => {
    setCurrentDate(new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000));
  };
  const handleNextWeek = () => {
    setCurrentDate(new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000));
  };
  const handleToggleTodo = (todo: any) => {
    if (isDeleteMode) return;
    const currentStatus = todo.isDone ?? todo._done ?? todo.is_done;
    updateStatus({
      id: todo.id,
      data: { is_done: !currentStatus },
    });
  };
  const handleEditClick = (e: React.MouseEvent, todo: any) => {
    e.stopPropagation();
    setSelectedTodo(todo);
    setIsEditModalOpen(true);
  };
  const handleBulkDelete = () => {
    if (selectedIds.length === 0) {
      setIsDeleteMode(!isDeleteMode);
      return;
    }
    if (window.confirm(`${selectedIds.length}개의 일정을 삭제하시겠습니까?`)) {
      deleteSchedules(
        { ids: selectedIds },
        {
          onSuccess: () => {
            setSelectedIds([]);
            setIsDeleteMode(false);
          },
        },
      );
    }
  };
  const toggleSelect = (id: number, e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };
  const grouped = useMemo(() => {
    const map = new Map<string, any[]>();
    const todayStr = formatDate(new Date());
    todoList.forEach((t) => {
      const isDoneValue = !!(t.isDone ?? t._done ?? t.is_done);
      const key = t.date || "언제든지 할 일";
      if (hidePast && key !== "언제든지 할 일" && key < todayStr) return;
      if (!map.has(key)) map.set(key, []);
      map.get(key)?.push({ ...t, calculatedIsDone: isDoneValue });
    });
    return Array.from(map.entries())
      .sort(([a], [b]) => {
        if (a === "언제든지 할 일") return -1;
        if (b === "언제든지 할 일") return 1;
        return a.localeCompare(b);
      })
      .map(([date, items]) => ({ date, items }));
  }, [todoList, hidePast]);
  const weekLabel = useMemo(() => {
    const f = from.split("-").slice(1).join(".");
    const t = to.split("-").slice(1).join(".");
    return `${f} - ${t}`;
  }, [from, to]);
  return (
    <div className="flex h-full w-full min-h-0 flex-col overflow-hidden rounded-3xl bg-white shadow-sm">
      <div className="sticky top-0 z-10 bg-white px-5 pt-4 border-b border-slate-50">
        <div className="flex items-center justify-between mb-3">
          <div className="text-[15px] font-bold text-slate-800">
            할일 리스트
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleBulkDelete}
              className={`px-3 py-1.5 rounded-full text-[11px] font-bold border transition-colors ${isDeleteMode ? "bg-red-500 text-white border-red-500" : "bg-red-50 text-red-500 border-red-100 hover:bg-red-100"}`}
            >
              {isDeleteMode
                ? selectedIds.length > 0
                  ? `삭제하기 (${selectedIds.length})`
                  : "취소"
                : "삭제하기"}
            </button>
            <button
              onClick={() => setHidePast(!hidePast)}
              className={`px-3 py-1.5 rounded-full border text-[11px] transition-all font-medium ${hidePast ? "bg-slate-800 text-white border-slate-800" : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"}`}
            >
              지난 일정 숨기기
            </button>
          </div>
        </div>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3 text-[14px] font-semibold text-slate-700">
            <button
              onClick={handlePrevWeek}
              className="p-1 hover:bg-slate-100 rounded"
            >
              ‹
            </button>
            <span>{weekLabel}</span>
            <button
              onClick={handleNextWeek}
              className="p-1 hover:bg-slate-100 rounded"
            >
              ›
            </button>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-5 py-4 scrollbar-hide">
        {isLoading ? (
          <div className="py-10 text-center text-slate-400 text-sm">
            로딩 중...
          </div>
        ) : grouped.length === 0 ? (
          <div className="py-10 text-center text-slate-400 text-[13px]">
            {hidePast ? "표시할 일정이 없습니다." : "등록된 일정이 없습니다."}
          </div>
        ) : (
          <div className="space-y-6 pb-10">
            {grouped.map((group) => (
              <div key={group.date} className="space-y-3">
                <div className="text-[12px] font-bold text-slate-400 ml-1">
                  {group.date}
                </div>
                <div className="space-y-2">
                  {group.items.map((todo) => (
                    <div
                      key={todo.id}
                      onClick={() => handleToggleTodo(todo)}
                      className={`group flex items-center gap-3 rounded-2xl border px-4 py-3 transition-all duration-200 cursor-pointer ${
                        todo.calculatedIsDone
                          ? "bg-slate-50 border-transparent opacity-60"
                          : "bg-white border-slate-100 hover:border-slate-300 shadow-sm"
                      }`}
                    >
                      {isDeleteMode && (
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(todo.id)}
                          onChange={(e) => toggleSelect(todo.id, e)}
                          onClick={(e) => e.stopPropagation()}
                          className="w-4 h-4 accent-slate-800 cursor-pointer"
                        />
                      )}
                      <div className="flex-1 flex items-center gap-3 min-w-0">
                        <div
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[18px] transition-colors hover:opacity-80"
                          style={{
                            backgroundColor: todo.calculatedIsDone
                              ? "#F1F5F9"
                              : `${todo.color}33`,
                          }}
                        >
                          {todo.emoji || "📝"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div
                            className={`truncate text-[14px] transition-all ${todo.calculatedIsDone ? "text-slate-400 line-through decoration-slate-400" : "text-slate-800 font-semibold"}`}
                          >
                            {todo.title}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={(e) => handleEditClick(e, todo)}
                        className="px-2 py-1 rounded-lg bg-slate-100 text-slate-500 text-[11px] font-medium hover:bg-slate-200 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        일정 변경하기
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {isEditModalOpen && selectedTodo && (
        <TodoEditModal
          mode="UPDATE"
          scheduleId={selectedTodo.id}
          initialData={{
            ...selectedTodo,
            bgColor: selectedTodo.color,
            repeatType: selectedTodo.repeatType || "NONE",
          }}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedTodo(null);
          }}
        />
      )}
    </div>
  );
}
