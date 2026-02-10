import React, { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, Loader2, Plus, X } from "lucide-react";
import {
  getWeeklyCompletionRate,
  getTogetherDays,
  // getDifficulty,  // ❗GET 없다면 안 씀(있어도 지금 요구사항상 초기엔 비움)
  postDifficulty,
  patchDifficulty,
  getGrassMap,
  getFocusChecklist,
  patchFocusChecklistItem,
} from "../api/analysis";
import { getMyInfo } from "../api/setting/profile";

/** 이모지 옵션 (난이도 1~7로 매핑됨) */
const emojiOptions = [
  {
    level: 1,
    emoji: "😌",
    label: "매우 쉬움",
    gradient:
      "linear-gradient(180deg, #E8FAF8 0%, #A8E6DF 40%, #5BCDC2 70%, #2DB5A8 100%)",
  },
  {
    level: 2,
    emoji: "😊",
    label: "쉬움",
    gradient:
      "linear-gradient(180deg, #EDFCFA 0%, #C5F0EA 40%, #9DE5DB 70%, #7DDAD0 100%)",
  },
  {
    level: 3,
    emoji: "🙂",
    label: "조금 쉬움",
    gradient:
      "linear-gradient(180deg, #FFFBEB 0%, #FEF3C7 40%, #FDE68A 70%, #FCD34D 100%)",
  },
  {
    level: 4,
    emoji: "😐",
    label: "보통",
    gradient:
      "linear-gradient(180deg, #F9FAFB 0%, #E5E7EB 40%, #D1D5DB 70%, #9CA3AF 100%)",
  },
  {
    level: 5,
    emoji: "😥",
    label: "조금 어려움",
    gradient:
      "linear-gradient(180deg, #FEF2F2 0%, #FECACA 40%, #FCA5A5 70%, #F87171 100%)",
  },
  {
    level: 6,
    emoji: "🥵",
    label: "어려움",
    gradient:
      "linear-gradient(180deg, #FEE2E2 0%, #FECACA 40%, #F87171 70%, #EF4444 100%)",
  },
  {
    level: 7,
    emoji: "🤯",
    label: "매우 어려움",
    gradient:
      "linear-gradient(180deg, #FEE2E2 0%, #FCA5A5 40%, #EF4444 70%, #DC2626 100%)",
  },
];

const getGrassColor = (count: number): string => {
  if (count === 0) return "#F1F1F1";
  if (count <= 2) return "#EEEAFE";
  if (count <= 5) return "#B9A7FF";
  if (count <= 8) return "#6B4EFF";
  return "#3B0BBF";
};

const dayKorean: Record<string, string> = {
  SUNDAY: "일요일",
  MONDAY: "월요일",
  TUESDAY: "화요일",
  WEDNESDAY: "수요일",
  THURSDAY: "목요일",
  FRIDAY: "금요일",
  SATURDAY: "토요일",
};

const dayShortKorean: Record<string, string> = {
  SUNDAY: "일",
  MONDAY: "월",
  TUESDAY: "화",
  WEDNESDAY: "수",
  THURSDAY: "목",
  FRIDAY: "금",
  SATURDAY: "토",
};

const dayOrder: Record<string, number> = {
  SUNDAY: 0,
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
};

const cardHoverStyle =
  "transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1";

const titleStyle: React.CSSProperties = {
  fontFamily: "Pretendard",
  fontWeight: 700,
  fontSize: "24px",
  fontStyle: "Bold",
};

export default function AnalyticsPage() {
  const queryClient = useQueryClient();

  const [distractionText, setDistractionText] = useState(
    ""
  );

  /** 난이도: GET이 없으므로, 프론트 로컬 상태로만 관리 */
  const [difficultyLocal, setDifficultyLocal] = useState<
    { date: string; difficultyLevel: number }[]
  >([]);

  const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(null);
  const [showEmojiModal, setShowEmojiModal] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState<{
    level: number;
    emoji: string;
    label: string;
    gradient: string;
  } | null>(null);

  // ===== Queries =====
  const {
    data: weeklyData,
    isLoading: isWeeklyLoading,
    isError: isWeeklyError,
  } = useQuery({
    queryKey: ["weeklyCompletionRate"],
    queryFn: getWeeklyCompletionRate,
    retry: false,
  });

  const { data: togetherData } = useQuery({
    queryKey: ["togetherDays"],
    queryFn: getTogetherDays,
    retry: false,
  });

  const { data: grassMapData, isLoading: isGrassMapLoading } = useQuery({
    queryKey: ["grassMap"],
    queryFn: getGrassMap,
    retry: false,
  });

  const { data: userInfo } = useQuery({
    queryKey: ["myInfo"],
    queryFn: getMyInfo,
    retry: false,
  });

  const { data: checklistData, isLoading: isChecklistLoading } = useQuery({
    queryKey: ["focusChecklist"],
    queryFn: getFocusChecklist,
    retry: false,
  });

  // ===== Mutations =====

  /** 체크리스트: 클릭 시 PATCH */
  const checklistMutation = useMutation({
    mutationFn: ({
      itemId,
      isCompleted,
    }: {
      itemId: number;
      isCompleted: boolean;
    }) => patchFocusChecklistItem(itemId, isCompleted),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["focusChecklist"] });
    },
    onError: () => {
      alert("체크리스트 업데이트에 실패했습니다.");
    },
  });

  /**
   * 난이도: 요구사항 request body
   * { date, difficultyLevel } (1~7)
   * - 최초: POST
   * - 재선택: PATCH
   */
  const difficultyMutation = useMutation({
    mutationFn: async ({
      date,
      difficultyLevel,
      isEdit,
    }: {
      date: string;
      difficultyLevel: number;
      isEdit: boolean;
    }) => {
      // ✅ API 함수도 이 시그니처로 맞춰져 있어야 함:
      // postDifficulty(date, difficultyLevel)
      // patchDifficulty(date, difficultyLevel)
      if (isEdit) {
        await patchDifficulty(date, difficultyLevel);
      } else {
        await postDifficulty(date, difficultyLevel);
      }
    },
    onSuccess: (_, variables) => {
      // ✅ 성공 시 alert 없음. UI만 반영
      setDifficultyLocal((prev) => {
        const exists = prev.some((x) => x.date === variables.date);
        if (exists) {
          return prev.map((x) =>
            x.date === variables.date
              ? { date: variables.date, difficultyLevel: variables.difficultyLevel }
              : x
          );
        }
        return [...prev, { date: variables.date, difficultyLevel: variables.difficultyLevel }];
      });

      setShowEmojiModal(false);
      setSelectedDayIndex(null);
      setSelectedDifficulty(null);
    },
    onError: () => {
      // ❗실패할 때만 메시지
      alert("난이도 저장에 실패했습니다. 다시 시도해주세요.");
    },
  });

  // ===== Data transforms =====
  const weeklyCompletionData = useMemo(() => {
    const rates = weeklyData?.weeklyRates ?? [];

    return [...rates]
      .sort((a, b) => dayOrder[a.dayOfWeek] - dayOrder[b.dayOfWeek])
      .map((item) => ({
        day: item.dayName || dayKorean[item.dayOfWeek] || item.dayOfWeek,
        rate: Math.round((item.completionRate ?? 0) * 100),
        dayOfWeek: item.dayOfWeek,
        totalCount: item.totalCount,
        completedCount: item.completedCount,
      }));
  }, [weeklyData]);

  const analysisMessages = weeklyData?.analysisMessages ?? [];

  const togetherDays = togetherData?.togetherDays;      // 총 일수
  const consecutiveDays = togetherData?.consecutiveDays; // 연속 일수

  /** 7일 카드(일~토): GET이 없으니 항상 기본 상태 */
  const difficultyDays = useMemo(() => {
    const today = new Date();
    const res: {
      day: string;
      date: string;
      difficultyLevel: number | null;
    }[] = [];

    // 이번 주 일요일 기준
    const sunday = new Date(today);
    sunday.setDate(today.getDate() - today.getDay());

    for (let i = 0; i < 7; i++) {
      const d = new Date(sunday);
      d.setDate(sunday.getDate() + i);
      const dateStr = d.toISOString().split("T")[0];

      const local = difficultyLocal.find((x) => x.date === dateStr);

      res.push({
        day: ["일", "월", "화", "수", "목", "금", "토"][i],
        date: dateStr,
        difficultyLevel: local?.difficultyLevel ?? null,
      });
    }
    return res;
  }, [difficultyLocal]);

  const grassData = useMemo(() => {
    return grassMapData?.grassMap ?? [];
  }, [grassMapData]);

  const nickname = userInfo?.data?.nickname || grassMapData?.nickname;
  const totalCompletedTasks = grassMapData?.totalCompletedTasks;

  const grassWeeks = useMemo(() => {
    if (grassData.length === 0) {
      // 빈 그리드(52주*7일)
      return Array.from({ length: 52 }, () =>
        Array.from({ length: 7 }, () => ({ date: "", count: 0 }))
      );
    }

    const weeks: { date: string; count: number }[][] = [];
    let current: { date: string; count: number }[] = [];

    grassData.forEach((day, idx) => {
      current.push(day);
      if (current.length === 7 || idx === grassData.length - 1) {
        weeks.push(current);
        current = [];
      }
    });

    return weeks;
  }, [grassData]);

  const months = ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan"];

  // ===== Handlers =====
  const handleChecklistToggle = (itemId: number, currentState: boolean) => {
    checklistMutation.mutate({ itemId, isCompleted: !currentState });
  };

  const handleDayClick = (index: number) => {
    setSelectedDayIndex(index);
    setSelectedDifficulty(null);
    setShowEmojiModal(true);
  };

  const handleConfirmDifficulty = () => {
    if (selectedDayIndex === null || !selectedDifficulty) return;

    const selectedDay = difficultyDays[selectedDayIndex];
    const isEdit = selectedDay.difficultyLevel !== null;

    difficultyMutation.mutate({
      date: selectedDay.date,
      difficultyLevel: selectedDifficulty.level, // ✅ 1~7
      isEdit,
    });
  };

  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];
  const todayIndex = difficultyDays.findIndex((d) => d.date === todayStr);

  const getDifficultyUI = (level: number | null) => {
    if (!level) return null;
    return emojiOptions.find((x) => x.level === level) ?? null;
  };

  return (
    <div className="w-full h-full flex flex-col overflow-hidden" style={{ fontFamily: "Pretendard" }}>
      {/* ===================== 상단 영역 ===================== */}
      <div className="grid grid-cols-[380px_1fr_2fr] gap-3 mb-3" style={{ height: "clamp(300px, 58vh, 500px)" }}>
        {/* 1) 요일별 완료율 */}
        <div className={`bg-white shadow-sm border ${cardHoverStyle} row-span-2 overflow-hidden flex flex-col`} style={{ borderRadius: "16px", padding: "20px" }}>
          <h2 className="text-[#0F1724] mb-4 text-left flex-shrink-0" style={titleStyle}>
            요일별 계획 대비 완료율
          </h2>

          {isWeeklyLoading ? (
            <div className="flex items-center justify-center flex-1">
              <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
            </div>
          ) : isWeeklyError ? (
            <div className="text-center text-gray-500 text-sm flex-1 flex items-center justify-center">
              데이터를 불러오지 못했습니다.
            </div>
          ) : (
            <>
              <div className="space-y-2 flex-shrink-0">
                {weeklyCompletionData.map((item) => (
                  <div key={item.day} className="flex items-center gap-3">
                    <span
                      className={`text-xs w-10 text-left flex-shrink-0 ${item.dayOfWeek === "SUNDAY" || item.dayOfWeek === "SATURDAY"
                          ? "text-red-500"
                          : "text-gray-600"
                        }`}
                    >
                      {item.day}
                    </span>

                    <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${item.rate}%`, backgroundColor: "#8B5CF6" }} />
                    </div>

                    <span className="text-xs text-gray-500 w-10 text-right flex-shrink-0">
                      {item.rate}%
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 text-[11px] text-gray-500 space-y-1 text-left flex-1 overflow-auto">
                {analysisMessages.length === 0 ? (
                  <p className="text-gray-400">
                    이번 주에는 분석 메시지가 아직 없어요.
                  </p>
                ) : (
                  analysisMessages.map((msg: any, idx: number) => (
                    <p key={idx}>
                      {typeof msg === "string" ? (
                        msg
                      ) : (
                        <>
                          {msg.message}
                          {msg.recommendation && (
                            <span className="block text-gray-400 mt-0.5">
                              {msg.recommendation}
                            </span>
                          )}
                        </>
                      )}
                    </p>
                  ))
                )}
              </div>
            </>
          )}
        </div>

        {/* 가운데+오른쪽 2행 */}
        <div className="col-span-2 grid grid-rows-2 gap-3">
          {/* 상단 행: Together + Difficulty */}
          <div className="grid grid-cols-[1fr_2fr] gap-3">
            {/* 2) TO:DAY 함께 */}
            <div className={`bg-white shadow-sm border ${cardHoverStyle} flex flex-col overflow-hidden`} style={{ borderRadius: "16px", padding: "16px" }}>
              <h2 className="text-[#0F1724] mb-2 text-left flex-shrink-0" style={titleStyle}>
                TO:DAY 와 함께하고 있어요.
              </h2>

              <div className="flex gap-3 justify-center flex-1 items-center min-h-0">
                <div
                  className="flex flex-col items-end justify-end p-3 transition-transform duration-300 hover:scale-105 aspect-square relative"
                  style={{
                    height: "100%",
                    maxHeight: "120px",
                    borderRadius: "16px",
                    background: "linear-gradient(180deg, #FFFFFF 0%, #F8FCFF 64.44%, #B9DCFE 100%)",
                    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.08)",
                  }}
                >
                  <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl font-bold text-[#0F1724]">
                    {togetherDays ?? "-"}
                  </span>
                  <span className="text-xs text-gray-400">총 일수</span>
                </div>

                <div
                  className="flex flex-col items-end justify-end p-3 transition-transform duration-300 hover:scale-105 aspect-square relative"
                  style={{
                    height: "100%",
                    maxHeight: "120px",
                    borderRadius: "16px",
                    background: "linear-gradient(180deg, #FFFFFF 0%, #DAE1E8 100%)",
                    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.08)",
                  }}
                >
                  <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl font-bold text-[#0F1724]">
                    {consecutiveDays ?? "-"}
                  </span>
                  <span className="text-xs text-gray-400">연속 일수</span>
                </div>
              </div>
            </div>

            {/* 3) 난이도 */}
            <div className={`bg-white shadow-sm border ${cardHoverStyle} overflow-hidden flex flex-col`} style={{ borderRadius: "16px", padding: "16px" }}>
              <h2 className="text-[#0F1724] mb-2 text-left flex-shrink-0" style={titleStyle}>
                일정 소화 난이도 성찰하기
              </h2>

              <div className="grid grid-cols-7 gap-1 flex-1 min-h-0">
                {difficultyDays.map((item, index) => {
                  const ui = getDifficultyUI(item.difficultyLevel);
                  const hasDifficulty = !!ui;

                  return (
                    <div
                      key={index}
                      className="flex flex-col items-center gap-1 cursor-pointer transition-transform duration-200 hover:scale-105 min-h-0"
                      style={{ width: "83px" }}
                      onClick={() => handleDayClick(index)}
                    >
                      <div
                        className={`flex items-center justify-center w-full flex-1 min-h-0 ${hasDifficulty
                            ? "" // ✅ 난이도 있으면 border 제거
                            : index === todayIndex
                              ? "border-2 border-blue-400"
                              : "border-2 border-gray-200"
                          }`}
                        style={{
                          borderRadius: "12px",
                          background: hasDifficulty
                            ? ui!.gradient
                            : index === todayIndex
                              ? "#EBF5FF"
                              : "#FFFFFF",
                          maxHeight: "152px",
                        }}
                      >
                        {hasDifficulty ? (
                          <div className="flex flex-col items-center">
                            <span className="text-lg">{ui!.emoji}</span>
                            <span className="text-[7px] text-gray-600 mt-0.5">
                              {ui!.label}
                            </span>
                          </div>
                        ) : (
                          <Plus className="w-4 h-4 text-gray-300" />
                        )}
                      </div>

                      <span className={`text-xs flex-shrink-0 ${index === todayIndex ? "text-blue-500 font-medium" : "text-gray-500"}`}>
                        {item.day}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 하단 행: 잡념 */}
          <div className={`bg-white shadow-sm border ${cardHoverStyle} overflow-hidden flex flex-col h-full min-h-0`} style={{ borderRadius: "16px", padding: "20px" }}>
            <h2 className="text-[#0F1724] mb-2 text-left flex-shrink-0" style={titleStyle}>
              몰입을 방해하는 잡념과 할 일들을 적어보세요.
            </h2>

            <textarea
              value={distractionText}
              onChange={(e) => setDistractionText(e.target.value)}
              className="w-full flex-1 p-3 text-sm text-gray-600 bg-gray-50 rounded-xl text-left resize-none min-h-0"
              placeholder="몰입을 방해하는 생각이나 할 일들을 자유롭게 적어보세요..."
            />

            <div className="flex justify-end mt-3 flex-shrink-0">
              <button
                onClick={() => setDistractionText("")}
                className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 hover:shadow-md transition-all duration-200"
              >
                등록하기
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ===================== 하단 영역 ===================== */}
      <div className="grid grid-cols-[2fr_1fr] gap-3 flex-1 min-h-0" style={{ maxHeight: "280px" }}>
        {/* 잔디맵 */}
        <div className={`bg-white shadow-sm border ${cardHoverStyle} overflow-hidden flex flex-col`} style={{ borderRadius: "16px", padding: "16px" }}>
          <h2 className="text-[#0F1724] mb-2 text-left flex-shrink-0" style={titleStyle}>
            {nickname ? `${nickname}님의 잔디, 이만큼 자랐어요!` : "잔디, 이만큼 자랐어요!"}
          </h2>

          {isGrassMapLoading ? (
            <div className="flex items-center justify-center flex-1">
              <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
            </div>
          ) : (
            <>
              <div className="flex mb-1 ml-4 flex-shrink-0">
                {months.map((m) => (
                  <span key={m} className="text-gray-400 flex-1" style={{ fontSize: "14px" }}>
                    {m}
                  </span>
                ))}
              </div>

              <div className="flex gap-[2px] overflow-hidden flex-1 min-h-0">
                {grassWeeks.map((week, wIdx) => (
                  <div key={wIdx} className="flex flex-col gap-[2px] flex-1">
                    {week.map((day, dIdx) => (
                      <div
                        key={dIdx}
                        className="rounded-sm transition-transform duration-150 hover:scale-150 flex-1"
                        style={{
                          backgroundColor: getGrassColor(day.count),
                          minWidth: "6px",
                          minHeight: "6px",
                          maxWidth: "14px",
                          maxHeight: "14px",
                          boxShadow: day.count === 0 ? "inset 0 0 0 1px rgba(0,0,0,0.05)" : "none",
                        }}
                        title={day.date ? `${day.date}: ${day.count}개` : undefined}
                      />
                    ))}
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between mt-2 flex-shrink-0">
                <p className="text-xs text-blue-500">
                  {totalCompletedTasks !== undefined
                    ? `1년간 ${totalCompletedTasks.toLocaleString()}개의 일정을 처리하셨어요!`
                    : "아직 완료한 일정이 없습니다."}
                </p>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-gray-400">적음</span>
                  {[0, 2, 4, 7, 10].map((c) => (
                    <div key={c} className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: getGrassColor(c) }} />
                  ))}
                  <span className="text-[10px] text-gray-400">많음</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* 체크리스트 */}
        <div className={`bg-white shadow-sm border relative ${cardHoverStyle} overflow-hidden flex flex-col`} style={{ borderRadius: "16px", padding: "16px" }}>
          <h2 className="text-[#0F1724] mb-3 text-left flex-shrink-0" style={titleStyle}>
            몰입 준비 체크리스트
          </h2>

          {isChecklistLoading ? (
            <div className="flex items-center justify-center flex-1">
              <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
            </div>
          ) : (
            <div className="space-y-2 flex-1 overflow-auto min-h-0">
              {checklistData?.items && checklistData.items.length > 0 ? (
                checklistData.items.map((item: any) => (
                  <label
                    key={item.itemId}
                    className="flex items-center gap-2 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 hover:shadow-sm transition-all duration-200 px-3 py-2"
                  >
                    <div
                      className={`w-5 h-5 flex-shrink-0 rounded-full border-2 flex items-center justify-center transition ${item.isCompleted ? "bg-blue-500 border-blue-500" : "border-gray-300 bg-white"
                        }`}
                      onClick={() => handleChecklistToggle(item.itemId, item.isCompleted)}
                    >
                      {item.isCompleted && <Check className="w-3 h-3 text-white" />}
                    </div>

                    {/* ✅ content로 렌더 */}
                    <span
                      className={`text-xs ${item.isCompleted ? "text-gray-400 line-through" : "text-gray-700"}`}
                    >
                      {item.content}
                    </span>
                  </label>
                ))
              ) : (
                <div className="text-center text-gray-400 text-sm py-4">
                  체크리스트 항목이 없습니다.
                </div>
              )}
            </div>
          )}

          <p className="absolute bottom-3 right-4 text-gray-400 flex-shrink-0" style={{ fontSize: "9px" }}>
            {checklistData?.nextResetAt
              ? `${checklistData.nextResetAt}에 갱신됩니다.`
              : "매일 오전 6시에 갱신됩니다."}
          </p>
        </div>
      </div>

      {/* ===================== 난이도 모달 ===================== */}
      {showEmojiModal && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={() => {
            setShowEmojiModal(false);
            setSelectedDifficulty(null);
          }}
        >
          <div
            className="bg-white rounded-2xl shadow-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            style={{ width: "700px", height: "400px" }}
          >
            <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
              <h3 className="text-[#0F1724]" style={{ fontWeight: 700, fontSize: "24px" }}>
                선택해주신 요일의 일정 소화 난이도를 알려주세요!
              </h3>
              <button
                onClick={() => {
                  setShowEmojiModal(false);
                  setSelectedDifficulty(null);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="px-8 py-10">
              <div className="flex justify-between gap-3">
                {emojiOptions.map((opt) => (
                  <button
                    key={opt.level}
                    onClick={() => setSelectedDifficulty(opt)}
                    className={`flex flex-col items-center justify-center gap-3 rounded-2xl transition-all duration-200 relative hover:scale-105 hover:shadow-lg ${selectedDifficulty?.level === opt.level ? "ring-4 ring-blue-500 shadow-lg" : ""
                      }`}
                    style={{
                      width: "95px",
                      height: "130px",
                      background: opt.gradient,
                    }}
                  >
                    {selectedDifficulty?.level === opt.level && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shadow-md">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <span className="text-4xl">{opt.emoji}</span>
                    <span className="text-xs text-gray-700 text-center font-medium">
                      {opt.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="px-8 pb-8">
              <button
                onClick={handleConfirmDifficulty}
                disabled={!selectedDifficulty || difficultyMutation.isPending}
                className="w-full py-5 bg-blue-500 text-white font-semibold rounded-xl hover:bg-blue-600 hover:shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200"
                style={{ fontWeight: 600, fontSize: "24px" }}
              >
                {difficultyMutation.isPending ? "저장 중..." : "확인"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}