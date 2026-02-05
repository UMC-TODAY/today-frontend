import { useMemo } from "react";
import { format, startOfMonth, endOfMonth } from "date-fns"; // date-fns 라이브러리 필요
import { useGetTodoCompletion } from "../../hooks/queries/useSchedule.ts";

export default function MonthlyTodoSummary() {
  // 1. 현재 날짜 기준으로 이번 달의 시작일(from)과 종료일(to) 계산
  const { from, to } = useMemo(() => {
    const now = new Date();
    return {
      from: format(startOfMonth(now), "yyyy-MM-dd"), // "2026-02-01"
      to: format(endOfMonth(now), "yyyy-MM-dd"), // "2026-02-28"
    };
  }, []);

  // 2. 계산된 from, to를 사용해 훅 호출
  const { data: completionRes, isLoading } = useGetTodoCompletion({ from, to });

  const completionData = completionRes?.data;

  if (isLoading) return <div>로딩 중...</div>;

  return (
    <div className="flex items-center gap-2 text-[14px] font-bold text-slate-700">
      <span>이번 달 달성률:</span>
      <span>
        {completionData?.completedCount ?? 0} /{" "}
        {completionData?.totalCount ?? 0}
      </span>
      {/* 퍼센트로 보여주고 싶다면 아래 로직 추가 */}
      <span className="text-blue-500 ml-1">
        (
        {completionData?.totalCount
          ? Math.round(
              (completionData.completedCount / completionData.totalCount) * 100,
            )
          : 0}
        %)
      </span>
    </div>
  );
}
