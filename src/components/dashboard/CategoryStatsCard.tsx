import { useMemo } from "react";
import { format } from "date-fns";
import { useGetTogetherDays } from "../../hooks/queries/useSchedule.ts";

export default function CategoryStatsCard() {
  const { data: togetherData, isLoading } = useGetTogetherDays();

  const referenceTime = useMemo(() => {
    return format(new Date(), "yyyy.MM.dd HH:mm 기준");
  }, []);

  if (isLoading) {
    return (
      <div className="w-full p-6 bg-white animate-pulse">
        <div className="h-6 w-20 bg-slate-100 rounded mb-3" />
        <div className="h-10 w-full bg-slate-50 rounded" />
      </div>
    );
  }

  return (
    <div className="w-full p-7 bg-white rounded-3xl transition-all box-border">
      <div className="flex flex-col gap-2">
        <span className="text-[16px] font-bold text-slate-800 tracking-tight">
          지금까지
        </span>

        <div className="flex flex-wrap items-baseline gap-x-1.5 overflow-hidden">
          <span className="text-[38px] font-black text-blue-500 leading-none">
            {togetherData?.togetherDays ?? 0}
          </span>
          <span className="text-[20px] font-bold text-slate-700">
            일의 값진 경험을 쌓아왔어요!
          </span>
        </div>

        <div className="mt-4 pt-3 flex flex-col gap-1">
          <span className="text-[11px] text-slate-300 font-medium">
            {referenceTime}
          </span>
        </div>
      </div>
    </div>
  );
}
