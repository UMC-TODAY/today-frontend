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
