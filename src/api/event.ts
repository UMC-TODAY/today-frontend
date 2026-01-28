import { axiosInstance } from "./core/axiosInstance";
import type { ApiResponse } from "../types/common";
import type {
  CreateScheduleRequest,
  GetMonthlyScheduleResponse,
  ScheduleParams,
  SearchScheduleParams,
  SearchScheduleResponse,
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
