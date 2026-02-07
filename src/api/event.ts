import { axiosInstance } from "./core/axiosInstance";
import type { ApiResponse } from "../types/common";
import type {
  BulkDeleteRequest,
  CreateScheduleRequest,
  GetMonthlyScheduleResponse,
  GetWeeklyResponse,
  ScheduleCompletionParams,
  ScheduleCompletionResponse,
  ScheduleDetail,
  ScheduleParams,
  SearchScheduleParams,
  SearchScheduleResponse,
  TodoCompletionParams,
  TodoCompletionResponse,
  TodoParams,
  TogetherDaysResponse,
  UpdateScheduleRequest,
  UpdateStatusRequest,
} from "../types/event.ts";

// 할일 필터링 및 검색 (조회)
export const getSchedule = async (params: SearchScheduleParams) => {
  const response = await axiosInstance.get<
    ApiResponse<SearchScheduleResponse[]>
  >("/api/v1/schedules", {
    params: params,
  });
  return response.data;
};

// 일정/할 일 등록 (캘린더/할일) 공통
export const postSchedule = async (data: CreateScheduleRequest) => {
  const response = await axiosInstance.post<ApiResponse<number>>(
    "/api/v1/schedules",
    data,
  );
  return response.data;
};

// 월별 일정 조회
export const getMonthlySchedule = async (params: ScheduleParams) => {
  const response = await axiosInstance.get<
    ApiResponse<GetMonthlyScheduleResponse>
  >("/api/v1/schedules/events", {
    params: params,
  });
  return response.data;
};

// 주간(기간) 별 투두 조회
export const getWeeklyTodo = async (params: TodoParams) => {
  const response = await axiosInstance.get<ApiResponse<GetWeeklyResponse>>(
    "api/v1/schedules/todos",
    {
      params: params,
    },
  );
  return response.data;
};

// 투두 컴플리션 조회
export const getTodoCompletion = async (params: TodoCompletionParams) => {
  const response = await axiosInstance.get<ApiResponse<TodoCompletionResponse>>(
    "/api/v1/schedules/todos/completion",
    { params },
  );
  return response.data;
};

// 스케쥴 컴플리션 조회
export const getScheduleCompletion = async (
  params: ScheduleCompletionParams,
) => {
  const response = await axiosInstance.get<
    ApiResponse<ScheduleCompletionResponse>
  >("/api/v1/schedules/events/completion", {
    params,
  });
  return response.data;
};

// 상태 변경
export const updateScheduleStatus = async (
  id: number,
  data: UpdateStatusRequest,
) => {
  const response = await axiosInstance.patch<ApiResponse<any>>(
    `/api/v1/schedules/${id}/status`,
    data,
  );
  return response.data;
};

// 일괄삭제
export const deleteSchedulesBulk = async (data: BulkDeleteRequest) => {
  const response = await axiosInstance.delete<ApiResponse<any>>(
    `/api/v1/schedules/bulk`,
    { data },
  );
  return response.data;
};

// 할일/일정 수정
export const updateSchedule = async (
  scheduleId: number,
  data: UpdateScheduleRequest,
) => {
  const response = await axiosInstance.patch<ApiResponse<ScheduleDetail>>(
    `/api/v1/schedules/${scheduleId}`,
    data,
  );
  return response.data;
};

// Today와 함께하고 있어요
// 가입일로부터 경과 일수 조회
export const getTogetherDays = async () => {
  const response = await axiosInstance.get<ApiResponse<TogetherDaysResponse>>(
    "/api/v1/analysis/together-days",
  );
  return response.data;
};
