import { axiosInstance } from "./core/axiosInstance";
import type { ApiResponse } from "../types/common";
import type {
  CreateScheduleRequest,
  SearchScheduleRequest,
  SearchScheduleResponse,
} from "../types/schedule";

// 할일/일정 필터링 및 검색
export const getSchedule = async (params: SearchScheduleRequest) => {
  const response = await axiosInstance.get<
    ApiResponse<SearchScheduleResponse[]>
  >("/api/v1/schedules", {
    params: params,
  });
  return response.data;
};

// 일정/할 일 등록
export const postSchedule = async (data: CreateScheduleRequest) => {
  const response = await axiosInstance.post<ApiResponse<null>>(
    "/api/v1/schedules",
    data,
  );
  return response.data;
};
