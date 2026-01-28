import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  getMonthlySchedule,
  getSchedule,
  postSchedule,
} from "../../api/event.ts";
import type {
  CreateScheduleRequest,
  ScheduleParams,
  SearchScheduleParams,
} from "../../types/event.ts";

export const useCreateSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateScheduleRequest) => postSchedule(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
      console.log("일정 등록 성공!");
      alert("일정이 등록되었습니다.");
    },
    onError: (error) => {
      console.error("등록 실패:", error);
    },
  });
};

export const useGetSchedule = (params: SearchScheduleParams) => {
  return useQuery({
    queryKey: ["schedules", params],
    queryFn: () => getSchedule(params),
  });
};

// 캘린더 - 월별 일정 조회
export const useGetMonthlySchedule = (params: ScheduleParams) => {
  return useQuery({
    queryKey: ["schedules", "monthly", params],
    queryFn: () => getMonthlySchedule(params),
    placeholderData: keepPreviousData, // 달력 넘길 때 로딩바 대신 이전 달 데이터 보여주다가 바뀌게
  });
};
