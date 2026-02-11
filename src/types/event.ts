// 1. get
// 할일/일정 필터링 및 검색 (할일)
export interface SearchScheduleParams {
  is_done: boolean;
  category: string;
  schedule_date: string;
  keyword: string;
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
  id: number;
  title: string;
  color: string;
  emoji: string;
  isDone: boolean;
  startedAt: string; // "2026-01-01 11:00"
  endedAt: string;
  source: string; // "GOOGLE"
  // ? date? 넣어야 될 수도
}

export interface GetMonthlyScheduleResponse {
  filter: string;
  events: ScheduleEvent[];
}

// 기간별 할 일 조회
export interface TodoParams {
  from: string;
  to: string;
  filter: "ALL" | "LOCAL" | "GOOGLE" | "NOTION" | "ICLOUD" | "CSV";
  hidePast?: boolean;
}

export interface Todos {
  id: number;
  title: string;
  color: string;
  emoji: string;
  isDone: boolean;
  date: string;
  mode: string;
}

export interface GetWeeklyResponse {
  filter: string;
  todos: Todos[];
}

// 기간 별 할일 완료 현황 조회
export interface TodoCompletionParams {
  from: string;
  to: string;
}

export interface TodoCompletionResponse {
  from: string;
  to: string;
  totalCount: number;
  completedCount: number;
}

// 기간 별 일정 완료 현황 조회
export interface ScheduleCompletionParams {
  year: number;
  month: number;
}

export interface ScheduleCompletionResponse {
  year: number;
  month: number;
  totalCount: number;
  completedCount: number;
}

// TODAY와 함께하고 있어요
// 가입 경과 일수 타입 (Together Days)
export interface TogetherDaysResponse {
  togetherDays: number;
  joinedAt: string;
  message: string;
}

// 뱃지 및 완료 일정 통계 조회
export interface BadgeStatusResponse {
  badge: StatItem;
  completedSchedule: StatItem;
}

export interface StatItem {
  totalCount: number;
  rankingPercent: number;
  rankingDirection: string;
}

// 내 정보 보기
export interface MyInfoResponse {
  memberId: number;
  nickname: string;
  profileImage: string;
  email: string;
}

// 2. post
// 일정/할 일 등록
// 1. 공통으로 들어가는 필드
interface BaseScheduleRequest {
  title: string;
  memo: string;
  emoji: string;
  bgColor: string;
  subSchedules?: CreateSubSchedule[];
}

// 2. [할일 - 사용자 지정]
interface TaskCustomRequest extends BaseScheduleRequest {
  scheduleType: "TASK";
  mode: "CUSTOM";
  date: string; // "2026-01-10"
  duration: number; // 분 단위
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
  startAt: string; // "2026-01-10 14:00"
  endAt: string; // "2026-01-10 15:00"
  repeatType: "NONE" | "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY";
}

// 5. 최종 통합 타입
export type CreateScheduleRequest =
  | TaskCustomRequest
  | TaskAnytimeRequest
  | EventCustomRequest;

// 생성 시 사용하는 하위 일정 타입
export interface CreateSubSchedule {
  subTitle: string;
  subColor: string;
  subEmoji: string;
}

// 3. PATCH
// 상태변경
export interface UpdateStatusRequest {
  is_done: boolean;
}

// 일정/할일 수정
export type ScheduleType = "EVENT" | "TODO";
export type ScheduleMode = "CUSTOM" | "ANYTIME";
export type RepeatType = "NONE" | "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY";

// 조회/수정 시 사용하는 하위 일정 타입
export interface SubSchedule {
  subScheduleId: number;
  title: string;
  subColor: string;
  subEmoji: string;
}

export interface ScheduleDetail {
  id: number;
  scheduleType: ScheduleType;
  mode: ScheduleMode;
  title: string;
  date: string;
  duration: number;
  isAllDay: boolean;
  repeatType: RepeatType;
  memo: string;
  emoji: string;
  bgColor: string;
  startAt: string;
  endAt: string;
  subSchedules: SubSchedule[];
}

// 수정 요청 데이터 타입
export interface UpdateScheduleRequest {
  scheduleType: ScheduleType;
  mode: ScheduleMode;
  title: string;
  date: string;
  duration: number;
  isAllDay: boolean;
  repeatType: RepeatType;
  memo: string;
  emoji: string;
  bgColor: string;
  startAt: string;
  endAt: string;
  subSchedules: {
    subScheduleId?: number; // 기존 항목은 ID 포함, 신규는 생략 가능성
    title: string;
    subColor: string;
    subEmoji: string;
  }[];
}

// 4. DELETE
// 일괄삭제
export interface BulkDeleteRequest {
  ids: number[];
}
