import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getSchedule, postSchedule } from "../../api/schedule";
import type {
  CreateScheduleRequest,
  SearchScheduleRequest,
} from "../../types/schedule";

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

export const useGetSchedule = (params: SearchScheduleRequest) => {
  return useQuery({
    queryKey: ["schedules", params],
    queryFn: () => getSchedule(params),
  });
};
