// 1. get
// 할일/일정 필터링 및 검색 (할일)

export interface SearchScheduleParams {
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

// 월별 일정 조회
export interface ScheduleParams {
  year: number;
  month: number;
  filter?: "ALL" | "LOCAL" | "GOOGLE" | "NOTION" | "ICLOUD" | "CSV";
  hidePast?: boolean;
}

export interface ScheduleEvent {
  id: number,
  title: string,
  color: string,
  emoji: string,
  isDone: boolean,
  startedAt: string, // "2026-01-01 11:00"
  endedAt: string,
  source: string // "GOOGLE"
  // ? date? 넣어야 될 수도
}


export interface GetMonthlyScheduleResponse {
  filter: string;
  events: ScheduleEvent[];
}


// 2. post
// 일정/할 일 등록
// 1. 공통으로 들어가는 필드
interface BaseScheduleRequest {
  title: string;
  memo: string;
  emoji: string;
  bgColor: string;
  subSchedules?: SubSchedule[];
}

// 2. [할일 - 사용자 지정]
interface TaskCustomRequest extends BaseScheduleRequest {
  scheduleType: "TASK";
  mode: "CUSTOM";
  date: string;       // "2026-01-10"
  duration: number;   // 분 단위
  repeatType: "NONE" | "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY";
}

// 3. [할일 - 언제든지]
interface TaskAnytimeRequest extends BaseScheduleRequest {
  scheduleType: "TASK";
  mode: "ANYTIME";
  duration: number;
}

// 4. [일정 - 사용자 지정]
interface EventCustomRequest extends BaseScheduleRequest {
  scheduleType: "EVENT";
  mode: "CUSTOM";
  startAt: string;    // "2026-01-10 14:00"
  endAt: string;      // "2026-01-10 15:00"
  repeatType: "NONE" | "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY";
}

// 5. 최종 통합 타입
export type CreateScheduleRequest =
  | TaskCustomRequest
  | TaskAnytimeRequest
  | EventCustomRequest;

export interface SubSchedule {
  subTitle: string;
  subColor: string;
  subEmoji: string;
}

// 3. PATCH

// 4. DELETE