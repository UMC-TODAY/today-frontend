import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postSchedule } from "../../api/schedule";
import type { CreateScheduleRequest } from "../../types/schedule";

export const SCHEDULE_KEYS = {
  all: ["schedules"] as const,
};

export const useCreateSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateScheduleRequest) => postSchedule(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SCHEDULE_KEYS.all });
      console.log("일정 등록 성공!");
      alert("일정이 등록되었습니다.");
    },
    onError: (error) => {
      console.error("등록 실패:", error);
    },
  });
};
