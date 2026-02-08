import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  deleteSchedulesBulk,
  getBadgeStatus,
  getMonthlySchedule,
  getMyInfo,
  getSchedule,
  getScheduleCompletion,
  getTodoCompletion,
  getTogetherDays,
  getWeeklyTodo,
  postCsvUpload,
  postSchedule,
  updateSchedule,
  updateScheduleStatus,
} from "../../api/event.ts";
import type {
  BulkDeleteRequest,
  CreateScheduleRequest,
  ScheduleCompletionParams,
  ScheduleParams,
  SearchScheduleParams,
  TodoCompletionParams,
  TodoParams,
  UpdateScheduleRequest,
} from "../../types/event.ts";

export const useCreateSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateScheduleRequest) => postSchedule(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
      queryClient.invalidateQueries({ queryKey: ["todos"] });
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

// 할일 - 주간별 일정 조회
export const useGetWeeklyTodo = (params: TodoParams) => {
  return useQuery({
    queryKey: ["todos", "weekly", params],
    queryFn: () => getWeeklyTodo(params),
    enabled: !!params.from && !!params.to, // 기간 정보가 있을 때만 실행
  });
};

// 투두 컴플리션 조회
export const useGetTodoCompletion = (params: TodoCompletionParams) => {
  return useQuery({
    queryKey: ["todos", "completion", params],
    queryFn: () => getTodoCompletion(params),
    enabled: !!params.from && !!params.to,
  });
};

// 스케쥴컴플리션 조회
export const useGetScheduleCompletion = (params: ScheduleCompletionParams) => {
  return useQuery({
    queryKey: ["schedules", "completion", params.year, params.month],
    queryFn: () => getScheduleCompletion(params),
    enabled: !!params.year && !!params.month,
  });
};

// 상태변경
export const useUpdateScheduleStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: { is_done: boolean } }) =>
      updateScheduleStatus(id, data),

    onSuccess: () => {
      // 성공 시 목록 데이터 무효화 및 다시 불러오기
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
    },
  });
};

// 일괄삭제
export const useDeleteSchedules = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BulkDeleteRequest) => deleteSchedulesBulk(data),
    onSuccess: () => {
      // 삭제 성공 시 리스트 새로고침
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
      alert("삭제되었습니다.");
    },
    onError: (err) => {
      console.error("삭제 실패:", err);
      alert("삭제 중 오류가 발생했습니다.");
    },
  });
};

// 일정/할일 수정
export const useUpdateSchedule = (scheduleId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateScheduleRequest) =>
      updateSchedule(scheduleId, data),
    onSuccess: (response) => {
      if (response.isSuccess) {
        queryClient.invalidateQueries({ queryKey: ["schedules"] });
        queryClient.invalidateQueries({ queryKey: ["todos"] });
        queryClient.invalidateQueries({ queryKey: ["schedule", scheduleId] });
      }
    },
    onError: (error) => {
      console.error("일정 수정 중 오류 발생:", error);
    },
  });
};

// TODAY와 함께하고있어요
export const useGetTogetherDays = () => {
  return useQuery({
    queryKey: ["togetherDays"],
    queryFn: getTogetherDays,
    select: (response) => response.data,
  });
};

// CSV 업로드 Mutation 훅
export const useCsvUpload = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postCsvUpload,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
      // queryClient.invalidateQueries({ queryKey: ["todos"] });
      alert("일정이 성공적으로 업로드되었습니다.");
    },
    onError: (error) => {
      console.error("CSV 업로드 실패:", error);
      alert("파일 업로드 중 오류가 발생했습니다.");
    },
  });
};

// 뱃지
export const useBadgeStatus = () => {
  return useQuery({
    queryKey: ["badgeStats"],
    queryFn: getBadgeStatus,
  });
};

// 내 정보 조회 훅
export const useMyInfo = () => {
  return useQuery({
    queryKey: ["myInfo"],
    queryFn: getMyInfo,
  });
};
