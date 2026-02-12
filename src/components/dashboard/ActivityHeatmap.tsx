import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getGrassMap, type GrassMapDay } from "../../api/analysis.ts";
import { format, parseISO } from "date-fns";

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
    const serverGrassData = response?.grass;
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

  return (
    <div className="w-full p-6 bg-white rounded-3xl overflow-hidden box-border">
      <div className="mb-6">
        <h2 className="text-[22px] font-bold text-slate-800">
          최근 3달 일정 처리 집계
        </h2>
      </div>

      <div className="w-full overflow-x-auto scrollbar-hide">
        <div className="flex justify-start md:justify-center gap-[5px] pb-2">
          {grassWeeks.map((week: GrassMapDay[], weekIdx: number) => {
            const firstDayOfVisibleWeek = week[0]?.date;
            const monthLabel = firstDayOfVisibleWeek
              ? format(parseISO(firstDayOfVisibleWeek), "MMM")
              : "";

            const isNewMonth =
              weekIdx === 0 ||
              (grassWeeks[weekIdx - 1] &&
                format(parseISO(grassWeeks[weekIdx - 1][0].date), "MMM") !==
                  monthLabel);

            return (
              <div
                key={weekIdx}
                className="relative flex shrink-0 flex-col gap-[5px] pt-7"
              >
                {isNewMonth && (
                  <span className="absolute top-0 left-0 text-[12px] font-semibold text-slate-400 whitespace-nowrap">
                    {monthLabel}
                  </span>
                )}

                {week.map((day) => (
                  <div
                    key={day.date}
                    title={`${day.date}: ${day.completedCount}개 완료`}
                    className="h-[14px] w-[14px] rounded-[3px] transition-all hover:bg-slate-200 cursor-help"
                    style={{ backgroundColor: getGrassColor(day.level) }}
                  />
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
