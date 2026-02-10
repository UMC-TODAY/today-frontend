import { axiosInstance } from "./core/axiosInstance";

// 요일별 완료율 응답 타입
export interface WeeklyRate {
  dayOfWeek: string;
  dayName: string;
  totalCount: number;
  completedCount: number;
  completionRate: number; // 0~1
}

export interface WeeklyCompletionApiData {
  weeklyRates: WeeklyRate[];
  analysisMessages: { type: string; message: string; recommendation: string }[]; // 빈 배열 올 수 있음
  statistics: {
    highestRate: number;
    lowestRate: number;
    averageRate: number;
    deviation: number;
  };
}

// 함께하고 있어요 응답 타입 (Swagger 기준)
export interface TogetherDaysResponse {
  togetherDays: number;     // 총 일수
  consecutiveDays: number;  // 연속 일수
  message?: string;
}

//TODO : 응답 타입 수정
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
export const getWeeklyCompletionRate = async (): Promise<WeeklyCompletionApiData> => {
  const response = await axiosInstance.get("/api/v1/analysis/weekly-completion-rate");
  return response.data.data; // ✅ 바깥 감싸진 것(isSuccess...) 말고 data 안의 data
};

// 함께하고 있어요 조회
export const getTogetherDays = async (): Promise<TogetherDaysResponse> => {
  const response = await axiosInstance.get("/api/v1/analysis/together-days");
  // 서버가 ApiResponse 래핑이면 data.data를 써야 함
  return response.data.data;
};

//TODO: API 수정되면 .data 수정 필요
// 난이도 조회
export const getDifficulty = async (): Promise<DifficultyResponse> => {
  const response = await axiosInstance.get("/api/v1/analysis/difficulty");
  return response.data;
};

// 난이도 등록
export const postDifficulty = async (date: string, difficultyLevel: number): Promise<void> => {
  await axiosInstance.post("/api/v1/analysis/difficulty", {  date, difficultyLevel });
};

// 난이도 수정
export const patchDifficulty = async (date: string, difficultyLevel: number): Promise<void> => {
  await axiosInstance.patch("/api/v1/analysis/difficulty", { date, difficultyLevel });
};

// 잔디맵 조회
export const getGrassMap = async (): Promise<GrassMapResponse> => {
  const response = await axiosInstance.get("/api/v1/analysis/grass-map");
  return response.data;
};

// 몰입 준비 체크리스트 응답 타입
export interface FocusChecklistItem {
  itemId: number;
  text: string;
  isCompleted: boolean;
}

export interface FocusChecklistResponse {
  items: FocusChecklistItem[];
  nextResetAt: string;
}

// 몰입 준비 체크리스트 조회
export const getFocusChecklist = async (): Promise<FocusChecklistResponse> => {
  const response = await axiosInstance.get("/api/v1/analysis/focus-checklist");
  return response.data.data;
};

// 몰입 준비 체크리스트 토글
export const patchFocusChecklistItem = async (itemId: number, isCompleted: boolean): Promise<void> => {
  await axiosInstance.patch(`/api/v1/analysis/focus-checklist/${itemId}`, { isCompleted });
};
