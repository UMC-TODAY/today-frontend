import { axiosInstance } from "./core/axiosInstance";

// 요일별 완료율 응답 타입
export interface WeeklyCompletionRate {
  dayOfWeek: string;
  completionRate: number;
}

export interface WeeklyCompletionResponse {
  weeklyCompletionRates: WeeklyCompletionRate[];
  analysisMessages: string[];
}

// 함께하고 있어요 응답 타입
export interface TogetherDaysResponse {
  totalDays: number;
  consecutiveDays: number;
}

// 난이도 응답 타입
export interface DifficultyDay {
  date: string;
  dayOfWeek: string;
  emoji: string | null;
  label: string | null;
}

export interface DifficultyResponse {
  difficulties: DifficultyDay[];
}

// 잔디맵 응답 타입
export interface GrassMapDay {
  date: string;
  count: number;
}

export interface GrassMapResponse {
  nickname: string;
  grassMap: GrassMapDay[];
  totalCompletedTasks: number;
}

// 요일별 완료율 조회
export const getWeeklyCompletionRate = async (): Promise<WeeklyCompletionResponse> => {
  const response = await axiosInstance.get("/api/v1/analysis/weekly-completion-rate");
  return response.data;
};

// 함께하고 있어요 조회
export const getTogetherDays = async (): Promise<TogetherDaysResponse> => {
  const response = await axiosInstance.get("/api/v1/analysis/together-days");
  return response.data;
};

// 난이도 조회
export const getDifficulty = async (): Promise<DifficultyResponse> => {
  const response = await axiosInstance.get("/api/v1/analysis/difficulty");
  return response.data;
};

// 난이도 등록
export const postDifficulty = async (date: string, emoji: string, label: string): Promise<void> => {
  await axiosInstance.post("/api/v1/analysis/difficulty", { date, emoji, label });
};

// 난이도 수정
export const patchDifficulty = async (date: string, emoji: string, label: string): Promise<void> => {
  await axiosInstance.patch("/api/v1/analysis/difficulty", { date, emoji, label });
};

// 잔디맵 조회
export const getGrassMap = async (): Promise<GrassMapResponse> => {
  const response = await axiosInstance.get("/api/v1/analysis/grass-map");
  return response.data;
};
