import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getGrassMap } from "../../api/analysis.ts";

const getGrassColor = (level: number): string => {
  const lvl = Number(level) || 0;
  if (lvl === 0) return "#F1F1F1";
  if (lvl === 1) return "#DDD6FE";
  if (lvl === 2) return "#B9A7FF";
  if (lvl === 3) return "#6B4EFF";
  return "#3B0BBF";
};
export default function ActivityHeatmap() {
  const { data: response, isLoading } = useQuery({
    queryKey: ["grassMap"],
    queryFn: getGrassMap,
    retry: false,
  });
  const grassWeeks = useMemo(() => {
    const serverGrassData = response?.data?.grass || response?.grass;
    if (!serverGrassData || !Array.isArray(serverGrassData)) return [];
    const weeks = [];
    for (let i = 0; i < serverGrassData.length; i += 7) {
      weeks.push(serverGrassData.slice(i, i + 7));
    }
    return weeks;
  }, [response]);
  if (isLoading)
    return (
      <div className="p-8 text-center text-slate-400 text-sm">로딩 중...</div>
    );
  const summary = response?.data?.summary || response?.summary;
  return (
    <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[16px] font-bold text-slate-800">
          최근 3달 일정 처리 집계
        </h2>
        <div className="text-[12px] text-slate-500 font-medium bg-slate-50 px-2 py-1 rounded-lg">
          총 {summary?.totalCompletedCount || 0}개 완료
        </div>
      </div>
      <div className="flex flex-row gap-[4px] overflow-x-auto pb-2 scrollbar-hide">
        {grassWeeks.map((week: any[], weekIdx: number) => (
          <div key={weekIdx} className="flex flex-col gap-[4px] shrink-0">
            {week.map((day) => (
              <div
                key={day.date}
                title={`${day.date}: ${day.completedCount}개 완료`}
                className="w-[12px] h-[12px] rounded-[2px] transition-all hover:bg-slate-200 cursor-help"
                style={{ backgroundColor: getGrassColor(day.level) }}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="mt-4 flex justify-end items-center gap-2 text-[11px] text-slate-400">
        <span>Less</span>
        <div className="flex gap-[3px]">
          {[0, 1, 2, 3, 4].map((lvl) => (
            <div
              key={lvl}
              className="w-[10px] h-[10px] rounded-[2px]"
              style={{ backgroundColor: getGrassColor(lvl) }}
            />
          ))}
        </div>
        <span>More</span>
      </div>
    </div>
  );
}
