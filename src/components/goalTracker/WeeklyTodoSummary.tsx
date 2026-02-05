import { useMemo } from "react";
import { format, startOfWeek, endOfWeek } from "date-fns";
import { useGetTodoCompletion } from "../../hooks/queries/useSchedule.ts";

export default function WeeklyTodoSummary() {
  const { from, to } = useMemo(() => {
    const now = new Date();
    return {
      from: format(startOfWeek(now, { weekStartsOn: 0 }), "yyyy-MM-dd"),
      to: format(endOfWeek(now, { weekStartsOn: 0 }), "yyyy-MM-dd"),
    };
  }, []);
  const { data: completionRes, isLoading } = useGetTodoCompletion({ from, to });
  const completionData = completionRes?.data;
  if (isLoading)
    return (
      <div className="text-slate-400 text-[11px] py-4">현황 로딩 중...</div>
    );
  const completedCount = completionData?.completedCount ?? 0;
  const totalCount = completionData?.totalCount ?? 0;
  const percentage =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  return (
    <div className="w-full">
      <h2 className="text-[20px] font-bold text-slate-700 mb-6">
        이번주 일정 완료 현황
      </h2>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
        <div className="flex-1 min-w-[200px]">
          <div className="relative h-3 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#9175F3] transition-all duration-700 ease-out rounded-full"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <div className="mt-2">
            <p className="text-[11px] text-slate-400 leading-tight">
              완료한 일정의 %에 맞는 배지를 증정해드려요!
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0 ml-auto">
          <div className="flex items-baseline gap-1">
            <span className="text-[18px] font-bold text-slate-800">
              {completedCount}
            </span>
            <span className="text-[18px] font-bold text-slate-400">/</span>
            <span className="text-[18px] font-bold text-slate-800">
              {totalCount}
            </span>
          </div>
          <div className="flex items-center justify-center w-10 h-10 bg-slate-50 rounded-full">
            <span className="text-[20px]">🔥</span>
          </div>
        </div>
      </div>
    </div>
  );
}
