import { useMemo, useState } from "react";
import {
  useGetMonthlySchedule,
  useDeleteSchedules,
  useUpdateScheduleStatus,
} from "../../hooks/queries/useSchedule";
import TodoEditModal from "../Modals/TodoEditModal.tsx";

type Schedule = {
  id: number;
  emoji: string;
  title: string;
  startedAt: string;
  color?: string;
  memo?: string;
  subSchedules?: any[];
  repeatType?: string;
  duration?: number;
  scheduleType?: string;
  mode?: string;
  isDone?: boolean;
  is_done?: boolean;
  _done?: boolean;
};
export default function ScheduleList() {
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(2);
  const [hidePast, setHidePast] = useState(false);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(
    null,
  );
  const { data: response, isLoading } = useGetMonthlySchedule({
    year: year,
    month: month,
    filter: "ALL",
    hidePast: hidePast,
  });
  const { mutate: deleteSchedules } = useDeleteSchedules();
  const { mutate: updateStatus } = useUpdateScheduleStatus();
  const scheduleList: Schedule[] = response?.data?.events || [];
  const handlePrevMonth = () => {
    if (month === 1) {
      setYear((prev) => prev - 1);
      setMonth(12);
    } else {
      setMonth((prev) => prev - 1);
    }
  };
  const handleNextMonth = () => {
    if (month === 12) {
      setYear((prev) => prev + 1);
      setMonth(1);
    } else {
      setMonth((prev) => prev + 1);
    }
  };
  const handleToggleStatus = (schedule: Schedule) => {
    if (isDeleteMode) return;
    const currentStatus = schedule.isDone ?? schedule._done ?? schedule.is_done;
    updateStatus({
      id: schedule.id,
      data: { is_done: !currentStatus },
    });
  };
  const handleEditClick = (e: React.MouseEvent, schedule: Schedule) => {
    e.stopPropagation();
    setSelectedSchedule(schedule);
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
    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

    scheduleList.forEach((s) => {
      const date = (s.startedAt || "").split(" ")[0];

      if (hidePast && date < todayStr) {
        return;
      }

      const isDoneValue = !!(s.isDone ?? s._done ?? s.is_done);
      const arr = map.get(date) ?? [];
      arr.push({ ...s, calculatedIsDone: isDoneValue });
      map.set(date, arr);
    });
    const dates = Array.from(map.keys()).sort((a, b) => a.localeCompare(b));
    return dates.map((date) => ({ date, items: map.get(date) ?? [] }));
  }, [scheduleList, hidePast]);
  return (
    <div className="flex h-full w-full min-h-0 flex-col overflow-hidden rounded-3xl bg-white shadow-sm">
      <div className="sticky top-0 z-10 bg-white px-5 pt-4 border-b border-slate-50">
        <div className="flex items-center justify-between mb-3">
          <div className="text-[15px] font-bold text-slate-800">
            일정 리스트
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
              type="button"
              onClick={() => setHidePast((v) => !v)}
              className={`px-3 py-1.5 rounded-full border text-[11px] transition-all font-medium ${
                hidePast
                  ? "bg-slate-800 text-white border-slate-800"
                  : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
              }`}
            >
              지난 일정 숨기기
            </button>
          </div>
        </div>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3 text-[14px] font-semibold text-slate-700">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1 hover:bg-slate-100 rounded"
            >
              ‹
            </button>
            <span>
              {year}.{String(month).padStart(2, "0")}
            </span>
            <button
              type="button"
              onClick={handleNextMonth}
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
                  {group.items.map((schedule) => (
                    <div
                      key={schedule.id}
                      onClick={() => handleToggleStatus(schedule)}
                      className={`group flex items-center gap-3 rounded-2xl border px-4 py-3 transition-all duration-200 cursor-pointer ${
                        schedule.calculatedIsDone
                          ? "bg-slate-50 border-transparent opacity-60"
                          : "bg-white border-slate-100 hover:border-slate-300 shadow-sm"
                      }`}
                    >
                      {isDeleteMode && (
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(Number(schedule.id))}
                          onChange={(e) => toggleSelect(Number(schedule.id), e)}
                          onClick={(e) => e.stopPropagation()}
                          className="w-4 h-4 accent-slate-800 cursor-pointer"
                        />
                      )}
                      <div className="flex-1 flex items-center gap-3 min-w-0">
                        <div
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[18px] transition-colors"
                          style={{
                            backgroundColor: schedule.calculatedIsDone
                              ? "#F1F5F9"
                              : schedule.color
                                ? `${schedule.color}33`
                                : "#F1F5F9",
                          }}
                        >
                          {schedule.emoji || "📅"}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div
                            className={`truncate text-[14px] transition-all ${
                              schedule.calculatedIsDone
                                ? "text-slate-400 line-through decoration-slate-400"
                                : "text-slate-800 font-semibold"
                            }`}
                          >
                            {schedule.title}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={(e) => handleEditClick(e, schedule)}
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
      {isEditModalOpen && selectedSchedule && (
        <TodoEditModal
          mode="UPDATE"
          scheduleId={selectedSchedule.id}
          initialData={{
            ...selectedSchedule,
            startAt: selectedSchedule.startedAt,
            bgColor: selectedSchedule.color,
            repeatType: selectedSchedule.repeatType || "NONE",
          }}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedSchedule(null);
          }}
        />
      )}
    </div>
  );
}
