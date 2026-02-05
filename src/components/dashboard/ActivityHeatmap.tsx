import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { format, subDays, eachDayOfInterval } from "date-fns";
import { getGrassMap } from "../../api/analysis.ts";

// 잔디 색상 (보라색 5단계)
const getGrassColor = (count: number): string => {
  if (count === 0) return "#F1F1F1";
  if (count <= 2) return "#EEEAFE";
  if (count <= 5) return "#B9A7FF";
  if (count <= 8) return "#6B4EFF";
  return "#3B0BBF";
};

export default function ActivityHeatmap() {
  // 1. API 데이터 가져오기
  const { data: response, isLoading } = useQuery({
    queryKey: ["grassMap"],
    queryFn: getGrassMap,
    retry: false,
  });

  // 2. 최근 91일간의 데이터 가공
  const grassData = useMemo(() => {
    const today = new Date();
    const ninetyDaysAgo = subDays(today, 90);

    // 최근 91일간의 모든 날짜 생성 (데이터가 없는 날짜도 회색으로 표시하기 위함)
    const allDays = eachDayOfInterval({
      start: ninetyDaysAgo,
      end: today,
    });

    const serverData = response?.grassMap || [];

    // 서버 데이터를 날짜 키값으로 맵핑
    const dataMap = new Map(
      serverData.map((item: any) => [item.date, item.count]),
    );

    return allDays.map((date) => {
      const dateStr = format(date, "yyyy-MM-dd");
      return {
        date: dateStr,
        count: dataMap.get(dateStr) || 0,
      };
    });
  }, [response]);

  // 3. 주 단위(7일)로 묶기
  const grassWeeks = useMemo(() => {
    const weeks = [];
    for (let i = 0; i < grassData.length; i += 7) {
      weeks.push(grassData.slice(i, i + 7));
    }
    return weeks;
  }, [grassData]);

  if (isLoading)
    return (
      <div className="p-8 text-center text-slate-400">
        데이터를 불러오는 중...
      </div>
    );

  return (
    <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-slate-800">
          최근 3달 일정 처리 집계
        </h2>
      </div>

      <div className="flex flex-row gap-[3px] overflow-x-auto pb-2 scrollbar-hide">
        {grassWeeks.map((week, weekIdx) => (
          <div key={weekIdx} className="flex flex-col gap-[3px] shrink-0">
            {week.map((day) => (
              <div
                key={day.date}
                title={`${day.date}: ${day.count}개 완료`}
                className="w-[13px] h-[13px] rounded-sm transition-transform hover:scale-125 cursor-help"
                style={{ backgroundColor: getGrassColor(day.count) }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
