import { useMemo } from "react";
import { useGetScheduleCompletion } from "../../hooks/queries/useSchedule.ts";
import { StarIcon } from "../icons/StarIcon.tsx";

export default function MonthlyTodoSummary() {
  const { year, month } = useMemo(() => {
    const now = new Date();
    return {
      year: now.getFullYear(),
      month: now.getMonth() + 1,
    };
  }, []);
  const { data: response, isLoading } = useGetScheduleCompletion({
    year,
    month,
  });
  const data = response?.data;
  const percentage = useMemo(() => {
    const total = data?.totalCount ?? 0;
    const completed = data?.completedCount ?? 0;
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  }, [data]);
  if (isLoading)
    return (
      <div className="text-slate-400 text-[11px] py-4">현황 로딩 중...</div>
    );
  return (
    <div className="w-full">
      <h2 className="text-[20px] font-bold text-slate-700 mb-6">
        이번달 일정 완료 현황
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
              {data?.completedCount ?? 0}
            </span>
            <span className="text-[18px] font-bold text-slate-400">/</span>
            <span className="text-[18px] font-bold text-slate-800">
              {data?.totalCount ?? 0}
            </span>
          </div>
          <StarIcon />
        </div>
      </div>
    </div>
  );
}
