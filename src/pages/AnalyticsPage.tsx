import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Check, X, Loader2 } from "lucide-react";
import {
  getWeeklyCompletionRate,
  getTogetherDays,
  getDifficulty,
  postDifficulty,
  patchDifficulty,
  getGrassMap,
  getFocusChecklist,
  patchFocusChecklistItem,
} from "../api/analysis";
import { getMyInfo } from "../api/setting/profile";

// 이모지 옵션 (자연스러운 그라데이션)
const emojiOptions = [
  {
    emoji: "😌",
    label: "매우 쉬움",
    gradient:
      "linear-gradient(180deg, #E8FAF8 0%, #A8E6DF 40%, #5BCDC2 70%, #2DB5A8 100%)",
  },
  {
    emoji: "😊",
    label: "쉬움",
    gradient:
      "linear-gradient(180deg, #EDFCFA 0%, #C5F0EA 40%, #9DE5DB 70%, #7DDAD0 100%)",
  },
  {
    emoji: "🙂",
    label: "조금 쉬움",
    gradient:
      "linear-gradient(180deg, #FFFBEB 0%, #FEF3C7 40%, #FDE68A 70%, #FCD34D 100%)",
  },
  {
    emoji: "😐",
    label: "보통",
    gradient:
      "linear-gradient(180deg, #F9FAFB 0%, #E5E7EB 40%, #D1D5DB 70%, #9CA3AF 100%)",
  },
  {
    emoji: "😥",
    label: "조금 어려움",
    gradient:
      "linear-gradient(180deg, #FEF2F2 0%, #FECACA 40%, #FCA5A5 70%, #F87171 100%)",
  },
  {
    emoji: "🥵",
    label: "어려움",
    gradient:
      "linear-gradient(180deg, #FEE2E2 0%, #FECACA 40%, #F87171 70%, #EF4444 100%)",
  },
  {
    emoji: "🤯",
    label: "매우 어려움",
    gradient:
      "linear-gradient(180deg, #FEE2E2 0%, #FCA5A5 40%, #EF4444 70%, #DC2626 100%)",
  },
];

// 난이도에 따른 그라데이션 반환
const getDifficultyGradient = (label: string | null): string => {
  if (!label) return "transparent";
  const option = emojiOptions.find((opt) => opt.label === label);
  return option?.gradient || "transparent";
};

// 잔디 색상 (보라색 5단계)
const getGrassColor = (count: number): string => {
  if (count === 0) return "#F1F1F1";
  if (count <= 2) return "#EEEAFE";
  if (count <= 5) return "#B9A7FF";
  if (count <= 8) return "#6B4EFF";
  return "#3B0BBF";
};

// 요일 한글 변환
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

// 요일 정렬 순서
const dayOrder: Record<string, number> = {
  SUNDAY: 0,
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
};

// 카드 호버 스타일
const cardHoverStyle =
  "transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1";

// 제목 스타일
const titleStyle: React.CSSProperties = {
  fontFamily: "Pretendard",
  fontWeight: 700,
  fontSize: "24px",
  fontStyle: "Bold",
};

export default function AnalyticsPage() {
  const queryClient = useQueryClient();

  const [distractionText, setDistractionText] = useState(
    "이번주는 너무 할일이 많았고, 같은 처리 방식을 가진 일이 하루안에 몰려있지 않고, 다양하게 처리해야하는 업무 부분, 일상 부분, 취미 부분이 하루에 다 몰려있어서 몰입하기 어려웠습니다."
  );
  const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(null);
  const [showEmojiModal, setShowEmojiModal] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState<{
    emoji: string;
    label: string;
  } | null>(null);

  // API 쿼리
  const { data: weeklyData, isLoading: isWeeklyLoading, isError: isWeeklyError } = useQuery({
    queryKey: ["weeklyCompletionRate"],
    queryFn: getWeeklyCompletionRate,
    retry: false,
  });

  const { data: togetherData } = useQuery({
    queryKey: ["togetherDays"],
    queryFn: getTogetherDays,
    retry: false,
  });

  const { data: difficultyData } = useQuery({
    queryKey: ["difficulty"],
    queryFn: getDifficulty,
    retry: false,
  });

  const { data: grassMapData, isLoading: isGrassMapLoading } = useQuery({
    queryKey: ["grassMap"],
    queryFn: getGrassMap,
    retry: false,
  });

  // 사용자 정보 조회
  const { data: userInfo } = useQuery({
    queryKey: ["myInfo"],
    queryFn: getMyInfo,
    retry: false,
  });

  // 몰입 준비 체크리스트 조회
  const { data: checklistData, isLoading: isChecklistLoading } = useQuery({
    queryKey: ["focusChecklist"],
    queryFn: getFocusChecklist,
    retry: false,
  });

  // 체크리스트 토글 mutation
  const checklistMutation = useMutation({
    mutationFn: ({ itemId, isCompleted }: { itemId: number; isCompleted: boolean }) =>
      patchFocusChecklistItem(itemId, isCompleted),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["focusChecklist"] });
    },
    onError: () => {
      alert("체크리스트 업데이트에 실패했습니다.");
    },
  });

  // 난이도 등록/수정 mutation
  const difficultyMutation = useMutation({
    mutationFn: async ({
      date,
      emoji,
      label,
      isEdit,
    }: {
      date: string;
      emoji: string;
      label: string;
      isEdit: boolean;
    }) => {
      if (isEdit) {
        await patchDifficulty(date, emoji, label);
      } else {
        await postDifficulty(date, emoji, label);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["difficulty"] });
      setShowEmojiModal(false);
      setSelectedDayIndex(null);
      setSelectedEmoji(null);
    },
    onError: () => {
      alert("난이도 저장 중 오류가 발생했습니다. 다시 시도해주세요.");
    },
  });

  // 요일별 완료율 데이터 (목업 제거, 일~토 정렬)
  const weeklyCompletionData = useMemo(() => {
    if (weeklyData?.weeklyCompletionRates) {
      return [...weeklyData.weeklyCompletionRates]
        .sort((a, b) => dayOrder[a.dayOfWeek] - dayOrder[b.dayOfWeek])
        .map((item) => ({
          day: dayKorean[item.dayOfWeek] || item.dayOfWeek,
          rate: Math.round(item.completionRate * 100),
          dayOfWeek: item.dayOfWeek,
        }));
    }
    return [];
  }, [weeklyData]);

  const analysisMessages = weeklyData?.analysisMessages || [];

  const totalDays = togetherData?.totalDays;
  const consecutiveDays = togetherData?.consecutiveDays;

  // 난이도 데이터 (7일 모두 미선택 상태로 초기화)
  const difficultyDays = useMemo(() => {
    if (difficultyData?.difficulties) {
      return difficultyData.difficulties.map((item) => ({
        day: dayShortKorean[item.dayOfWeek] || item.dayOfWeek,
        date: item.date,
        emoji: item.emoji,
        label: item.label,
      }));
    }
    // GET이 없으므로 7일 모두 미선택 상태로 초기화
    const today = new Date();
    const result = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - today.getDay() + i);
      result.push({
        day: ["일", "월", "화", "수", "목", "금", "토"][i],
        date: date.toISOString().split("T")[0],
        emoji: null,
        label: null,
      });
    }
    return result;
  }, [difficultyData]);

  // 잔디맵 데이터 (빈 배열이어도 그리드는 렌더링)
  const grassData = useMemo(() => {
    if (grassMapData?.grassMap) {
      return grassMapData.grassMap;
    }
    return [];
  }, [grassMapData]);

  // 사용자 닉네임
  const nickname = userInfo?.data?.nickname || grassMapData?.nickname;
  const totalCompletedTasks = grassMapData?.totalCompletedTasks;

  // 잔디맵을 주 단위로 그룹화 (데이터가 없어도 빈 그리드 표시를 위해)
  const grassWeeks = useMemo(() => {
    if (grassData.length === 0) {
      // 1년치 빈 데이터 생성 (365일 / 7 = 약 52주)
      const emptyWeeks: { date: string; count: number }[][] = [];
      for (let w = 0; w < 52; w++) {
        const week: { date: string; count: number }[] = [];
        for (let d = 0; d < 7; d++) {
          week.push({ date: "", count: 0 });
        }
        emptyWeeks.push(week);
      }
      return emptyWeeks;
    }

    const weeks: { date: string; count: number }[][] = [];
    let currentWeek: { date: string; count: number }[] = [];

    grassData.forEach((day, index) => {
      currentWeek.push(day);
      if (currentWeek.length === 7 || index === grassData.length - 1) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    });

    return weeks;
  }, [grassData]);

  const months = ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan"];

  const handleChecklistToggle = (itemId: number, currentState: boolean) => {
    checklistMutation.mutate({ itemId, isCompleted: !currentState });
  };

  const handleDistractionSubmit = () => {
    setDistractionText("");
  };

  const handleEmojiSelect = (emoji: string, label: string) => {
    setSelectedEmoji({ emoji, label });
  };

  const handleConfirmEmoji = () => {
    if (selectedDayIndex !== null && selectedEmoji) {
      const selectedDay = difficultyDays[selectedDayIndex];
      const isEdit = selectedDay.emoji !== null;
      difficultyMutation.mutate({
        date: selectedDay.date,
        emoji: selectedEmoji.emoji,
        label: selectedEmoji.label,
        isEdit,
      });
    }
  };

  const handleDayClick = (index: number) => {
    setSelectedDayIndex(index);
    setSelectedEmoji(null);
    setShowEmojiModal(true);
  };

  // 오늘 날짜의 인덱스 찾기
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];
  const todayIndex = difficultyDays.findIndex((d) => d.date === todayStr);

  return (
    <div
      className="w-full h-full flex flex-col overflow-hidden"
      style={{ fontFamily: "Pretendard" }}
    >
      {/* ===================== 상단 영역 (Grid 반응형 배치) ===================== */}
      <div
        className="grid grid-cols-[380px_1fr_2fr] gap-3 mb-3"
        style={{ height: "clamp(300px, 58vh, 500px)" }}
      >
        {/* 1) 요일별 계획 대비 완료율 (좌측, row-span 2) */}
        <div
          className={`bg-white shadow-sm border ${cardHoverStyle} row-span-2 overflow-hidden flex flex-col`}
          style={{ borderRadius: "16px", padding: "20px" }}
        >
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
          ) : weeklyCompletionData.length === 0 ? (
            <div className="text-center text-gray-500 text-sm flex-1 flex items-center justify-center">
              이번 주 완료율 데이터가 없습니다.
            </div>
          ) : (
            <>
              <div className="space-y-2 flex-shrink-0">
                {weeklyCompletionData.map((item) => (
                  <div key={item.day} className="flex items-center gap-3">
                    <span
                      className={`text-xs w-10 text-left flex-shrink-0 ${
                        item.dayOfWeek === "SUNDAY" || item.dayOfWeek === "SATURDAY" ? "text-red-500" : "text-gray-600"
                      }`}
                    >
                      {item.day}
                    </span>
                    <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${item.rate}%`, backgroundColor: "#8B5CF6" }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 w-10 text-right flex-shrink-0">{item.rate}%</span>
                  </div>
                ))}
              </div>

              <div className="mt-4 text-[11px] text-gray-500 space-y-1 text-left flex-1 overflow-auto">
                {analysisMessages.map((msg: any, idx: number) => (
                  <p key={idx}>
                    {typeof msg === 'string' ? msg : (
                      <>
                        {msg.message}
                        {msg.recommendation && (
                          <span className="block text-gray-400 mt-0.5">{msg.recommendation}</span>
                        )}
                      </>
                    )}
                  </p>
                ))}
              </div>
            </>
          )}
        </div>

        {/* 가운데+오른쪽 영역을 2행으로 나눔 */}
        <div className="col-span-2 grid grid-rows-2 gap-3">
          {/* 상단 행: TO:DAY + 난이도 (비율 1:2) */}
          <div className="grid grid-cols-[1fr_2fr] gap-3">
            {/* 2) TO:DAY 와 함께하고 있어요 */}
            <div className={`bg-white shadow-sm border ${cardHoverStyle} flex flex-col overflow-hidden`} style={{ borderRadius: "16px", padding: "16px" }}>
              <h2 className="text-[#0F1724] mb-2 text-left flex-shrink-0" style={titleStyle}>
                TO:DAY 와 함께하고 있어요.
              </h2>

              <div className="flex gap-3 justify-center flex-1 items-center min-h-0">
                {/* 총 일수 */}
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
                  <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl font-bold text-[#0F1724]">
                    {totalDays ?? '-'}
                  </span>
                  <span className="text-xs text-gray-400">총 일수</span>
                </div>

                {/* 연속 일수 */}
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
                  <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl font-bold text-[#0F1724]">
                    {consecutiveDays ?? '-'}
                  </span>
                  <span className="text-xs text-gray-400">연속 일수</span>
                </div>
              </div>
            </div>

            {/* 3) 일정 소화 난이도 성찰하기 */}
            <div className={`bg-white shadow-sm border ${cardHoverStyle} overflow-hidden flex flex-col`} style={{ borderRadius: "16px", padding: "16px" }}>
              <h2 className="text-[#0F1724] mb-2 text-left flex-shrink-0" style={titleStyle}>
                일정 소화 난이도 성찰하기
              </h2>

              {/* 7등분 grid - 83*152 비율 */}
              <div className="grid grid-cols-7 gap-1 flex-1 min-h-0">
                {difficultyDays.map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center gap-1 cursor-pointer transition-transform duration-200 hover:scale-105 min-h-0"
                    style={{ width: "83px" }}
                    onClick={() => handleDayClick(index)}
                  >
                    <div
                      className={`flex items-center justify-center w-full flex-1 min-h-0 ${
                        item.emoji ? "" : index === todayIndex ? "border-2 border-blue-400" : "border-2 border-gray-200"
                      }`}
                      style={{
                        borderRadius: "12px",
                        background: item.emoji ? getDifficultyGradient(item.label) : index === todayIndex ? "#EBF5FF" : "#FFFFFF",
                        maxHeight: "152px",
                      }}
                    >
                      {item.emoji ? (
                        <div className="flex flex-col items-center">
                          <span className="text-lg">{item.emoji}</span>
                          <span className="text-[7px] text-gray-600 mt-0.5" style={{ fontFamily: "Pretendard" }}>
                            {item.label}
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
                ))}
              </div>
            </div>
          </div>

          {/* 하단 행: 몰입을 방해하는 잡념 */}
          <div
            className={`bg-white shadow-sm border ${cardHoverStyle} overflow-hidden flex flex-col h-full`}
            style={{ borderRadius: "16px", padding: "20px" }}
          >
            <h2 className="text-[#0F1724] mb-2 text-left flex-shrink-0" style={titleStyle}>
              몰입을 방해하는 잡념과 할 일들을 적어보세요.
            </h2>

            <textarea
              value={distractionText}
              onChange={(e) => setDistractionText(e.target.value)}
              className="w-full flex-1 p-3 text-sm text-gray-600 bg-gray-50 rounded-xl text-left resize-none min-h-0"
              style={{ fontFamily: "Pretendard" }}
              placeholder="몰입을 방해하는 생각이나 할 일들을 자유롭게 적어보세요..."
            />

            <div className="flex justify-end mt-3 flex-shrink-0">
              <button
                onClick={handleDistractionSubmit}
                className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 hover:shadow-md transition-all duration-200"
                style={{ fontFamily: "Pretendard" }}
              >
                등록하기
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ===================== 하단 영역 (잔디맵 7:3 비율) ===================== */}
      <div className="grid grid-cols-[2fr_1fr] gap-3 flex-1 min-h-0" style={{ maxHeight: "280px" }}>
        {/* 잔디맵 */}
        <div className={`bg-white shadow-sm border ${cardHoverStyle} overflow-hidden flex flex-col`} style={{ borderRadius: "16px", padding: "16px" }}>
          <h2 className="text-[#0F1724] mb-2 text-left flex-shrink-0" style={titleStyle}>
            {nickname ? `${nickname}님의 잔디, 이만큼 자랐어요!` : '잔디, 이만큼 자랐어요!'}
          </h2>

          {isGrassMapLoading ? (
            <div className="flex items-center justify-center flex-1">
              <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
            </div>
          ) : (
            <>
              {/* Month labels */}
              <div className="flex mb-1 ml-4 flex-shrink-0">
                {months.map((month, idx) => (
                  <span key={idx} className="text-gray-400 flex-1" style={{ fontFamily: "Pretendard", fontSize: "14px" }}>
                    {month}
                  </span>
                ))}
              </div>

              {/* Grass grid - 항상 렌더링 */}
              <div className="flex gap-[2px] overflow-hidden flex-1 min-h-0">
                {grassWeeks.map((week, weekIdx) => (
                  <div key={weekIdx} className="flex flex-col gap-[2px] flex-1">
                    {week.map((day, dayIdx) => (
                      <div
                        key={dayIdx}
                        className="rounded-sm transition-transform duration-150 hover:scale-150 flex-1"
                        style={{
                          backgroundColor: getGrassColor(day.count),
                          minWidth: "6px",
                          minHeight: "6px",
                          maxWidth: "14px",
                          maxHeight: "14px",
                          // count=0이어도 존재감 유지
                          boxShadow: day.count === 0 ? "inset 0 0 0 1px rgba(0,0,0,0.05)" : "none",
                        }}
                        title={day.date ? `${day.date}: ${day.count}개` : undefined}
                      />
                    ))}
                  </div>
                ))}
              </div>

              {/* Legend & Summary */}
              <div className="flex items-center justify-between mt-2 flex-shrink-0">
                <p className="text-xs text-blue-500" style={{ fontFamily: "Pretendard" }}>
                  {totalCompletedTasks !== undefined
                    ? `1년간 ${totalCompletedTasks.toLocaleString()}개의 일정을 처리하셨어요!`
                    : '아직 완료한 일정이 없습니다.'}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-gray-400">적음</span>
                  {[0, 2, 4, 7, 10].map((count, idx) => (
                    <div key={idx} className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: getGrassColor(count) }} />
                  ))}
                  <span className="text-[10px] text-gray-400">많음</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* 몰입 준비 체크리스트 */}
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
                checklistData.items.map((item) => (
                  <label
                    key={item.itemId}
                    className="flex items-center gap-2 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 hover:shadow-sm transition-all duration-200 px-3 py-2"
                  >
                    <div
                      className={`w-5 h-5 flex-shrink-0 rounded-full border-2 flex items-center justify-center transition ${
                        item.isCompleted ? "bg-blue-500 border-blue-500" : "border-gray-300 bg-white"
                      }`}
                      onClick={() => handleChecklistToggle(item.itemId, item.isCompleted)}
                    >
                      {item.isCompleted && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <span
                      className={`text-xs ${item.isCompleted ? "text-gray-400 line-through" : "text-gray-700"}`}
                      style={{ fontFamily: "Pretendard" }}
                    >
                      {item.text}
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

          <p className="absolute bottom-3 right-4 text-gray-400 flex-shrink-0" style={{ fontFamily: "Pretendard", fontSize: "9px" }}>
            매일 오전 6시에 갱신됩니다.
          </p>
        </div>
      </div>

      {/* ===================== 이모지 선택 모달 ===================== */}
      {showEmojiModal && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={() => {
            setShowEmojiModal(false);
            setSelectedEmoji(null);
          }}
        >
          <div
            className="bg-white rounded-2xl shadow-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            style={{ width: "700px", height: "400px" }}
          >
            {/* 모달 헤더 */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
              <h3
                className="text-[#0F1724]"
                style={{ fontFamily: "Pretendard", fontWeight: 700, fontSize: "24px" }}
              >
                선택해주신 요일의 일정 소화 난이도를 알려주세요!
              </h3>
              <button
                onClick={() => {
                  setShowEmojiModal(false);
                  setSelectedEmoji(null);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* 이모지 옵션들 */}
            <div className="px-8 py-10">
              <div className="flex justify-between gap-3">
                {emojiOptions.map((option) => (
                  <button
                    key={option.emoji}
                    onClick={() => handleEmojiSelect(option.emoji, option.label)}
                    className={`flex flex-col items-center justify-center gap-3 rounded-2xl transition-all duration-200 relative hover:scale-105 hover:shadow-lg ${
                      selectedEmoji?.emoji === option.emoji ? "ring-4 ring-blue-500 shadow-lg" : ""
                    }`}
                    style={{
                      width: "95px",
                      height: "130px",
                      background: option.gradient,
                    }}
                  >
                    {selectedEmoji?.emoji === option.emoji && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shadow-md">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <span className="text-4xl">{option.emoji}</span>
                    <span className="text-xs text-gray-700 text-center font-medium" style={{ fontFamily: "Pretendard" }}>
                      {option.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 확인 버튼 */}
            <div className="px-8 pb-8">
              <button
                onClick={handleConfirmEmoji}
                disabled={!selectedEmoji || difficultyMutation.isPending}
                className="w-full py-5 bg-blue-500 text-white font-semibold rounded-xl hover:bg-blue-600 hover:shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200"
                style={{ fontFamily: "Pretendard", fontWeight: 600, fontSize: "24px" }}
              >
                {difficultyMutation.isPending ? '저장 중...' : '확인'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
