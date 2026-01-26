// 1. get
// 할일/일정 필터링 및 검색

export interface SearchScheduleRequest {
  is_done: boolean,
  category: string,
  schedule_date: string,
  keyword: string,
}

export interface SearchScheduleResponse {
  id: number;
  title: string;
  category: string;
  schedule_date: string;
  emoji: string;
  is_done: boolean;
}

// 2. post
// 일정/할 일 등록
export interface SubSchedule {
  subTitle: string;
  subColor: string; // HEX 값
  subEmoji: string;
}

export interface CreateScheduleRequest {
  scheduleType: "TASK" | "EVENT";
  mode: "CUSTOM" | "ANYTIME";

  title: string;
  date: string; // "2026-01-10"
  duration: number; // 분 단위

  repeatType: "NONE" | "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY";

  memo: string;
  emoji: string;
  bgColor: string; // HEX 값

  subSchedules?: SubSchedule[];
}

// 3. PATCH

// 4. DELETE