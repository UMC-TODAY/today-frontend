import { axiosInstance } from "./core/axiosInstance";
import type { ApiResponse } from "../types/common";
import type { CreateScheduleRequest } from "../types/schedule";

export const postSchedule = async (data: CreateScheduleRequest) => {
  const response = await axiosInstance.post<ApiResponse<null>>(
    "/api/v1/schedules",
    data,
  );
  return response.data;
};
