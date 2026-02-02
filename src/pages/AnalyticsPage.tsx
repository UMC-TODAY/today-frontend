import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Check, X } from "lucide-react";
import {
  getWeeklyCompletionRate,
  getTogetherDays,
  getDifficulty,
  postDifficulty,
  patchDifficulty,
  getGrassMap,
} from "../api/analysis";

// 이모지 옵션 (그라데이션 배경 포함)
const emojiOptions = [
  { emoji: "😌", label: "매우 쉬움", gradient: "linear-gradient(180deg, #FFFFFF 0%, #D4EDDA 100%)" },
  { emoji: "😊", label: "쉬움", gradient: "linear-gradient(180deg, #FFFFFF 0%, #C3E6CB 100%)" },
  { emoji: "🙂", label: "조금 쉬움", gradient: "linear-gradient(180deg, #FFFFFF 0%, #FFF3CD 100%)" },
  { emoji: "😐", label: "보통", gradient: "linear-gradient(180deg, #FFFFFF 0%, #E2E3E5 100%)" },
  { emoji: "😥", label: "조금 어려움", gradient: "linear-gradient(180deg, #FFFFFF 0%, #F8D7DA 100%)" },
  { emoji: "🥵", label: "어려움", gradient: "linear-gradient(180deg, #FFFFFF 0%, #F5C6CB 100%)" },
  { emoji: "🤯", label: "매우 어려움", gradient: "linear-gradient(180deg, #FFFFFF 0%, #F1B0B7 100%)" },
];

// 난이도에 따른 그라데이션 반환
const getDifficultyGradient = (label: string | null): string => {
  if (!label) return "transparent";
  const option = emojiOptions.find(opt => opt.label === label);
  return option?.gradient || "transparent";
};

// 체크리스트 아이템 (데모용)
const defaultChecklistItems = [
  { id: 1, text: "필요한 참고 자료 탭만 열기", checked: false },
  { id: 2, text: "휴대폰 무음 및 뒤집기", checked: false },
  { id: 3, text: "물 또는 음료 준비하기", checked: false },
  { id: 4, text: "완료할 일정 정하기", checked: false },
];

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

// 데모용 잔디 데이터 생성
const generateDemoGrassData = () => {
  const data: { date: string; count: number }[] = [];
  const today = new Date();
  for (let i = 364; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toISOString().split("T")[0],
      count: Math.floor(Math.random() * 12),
    });
  }
  return data;
};

export default function AnalyticsPage() {
  const queryClient = useQueryClient();
  const [distractionText, setDistractionText] = useState(
    "이번주는 너무 할일이 많았고, 같은 처리 방식을 가진 일이 하루안에 몰려있지 않고, 다양하게 처리해야하는 업무 부분, 일상 부분, 취미 부분이 하루에 다 몰려있어서 몰입하기 어려웠습니다."
  );
  const [checklist, setChecklist] = useState(defaultChecklistItems);
  const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(null);
  const [showEmojiModal, setShowEmojiModal] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState<{ emoji: string; label: string } | null>(null);
  const pendingCount = 1;

  // API 쿼리
  const { data: weeklyData } = useQuery({
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

  const { data: grassMapData } = useQuery({
    queryKey: ["grassMap"],
    queryFn: getGrassMap,
    retry: false,
  });

  // 난이도 등록/수정 mutation
  const difficultyMutation = useMutation({
    mutationFn: async ({ date, emoji, label, isEdit }: { date: string; emoji: string; label: string; isEdit: boolean }) => {
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
  });

  // 데모 데이터
  const weeklyCompletionData = useMemo(() => {
    if (weeklyData?.weeklyCompletionRates) {
      return weeklyData.weeklyCompletionRates.map((item) => ({
        day: dayKorean[item.dayOfWeek] || item.dayOfWeek,
        rate: Math.round(item.completionRate),
      }));
    }
    return [
      { day: "일요일", rate: 32 },
      { day: "월요일", rate: 100 },
      { day: "화요일", rate: 47 },
      { day: "수요일", rate: 72 },
      { day: "목요일", rate: 30 },
      { day: "금요일", rate: 56 },
      { day: "토요일", rate: 42 },
    ];
  }, [weeklyData]);

  const analysisMessages = weeklyData?.analysisMessages || [
    "요일별로 계획 유지 비율의 차이가 나타납니다.",
    "월요일, 수요일에는 계획 대비 완료 비율이 높은 편입니다. 목요일, 일요일에는 계획한 일정이 일부 완료되지 않는 경우가 많았습니다.",
    "완료율이 높은 월요일의 일정 구성을 참고해보세요.",
  ];

  const totalDays = togetherData?.totalDays ?? 365;
  const consecutiveDays = togetherData?.consecutiveDays ?? 20;

  const difficultyDays = useMemo(() => {
    if (difficultyData?.difficulties) {
      return difficultyData.difficulties.map((item) => ({
        day: dayShortKorean[item.dayOfWeek] || item.dayOfWeek,
        date: item.date,
        emoji: item.emoji,
        label: item.label,
      }));
    }
    return [
      { day: "일", date: "2026-02-01", emoji: null, label: null },
      { day: "월", date: "2026-02-02", emoji: "🥵", label: "어려움" },
      { day: "화", date: "2026-02-03", emoji: "🥵", label: "어려움" },
      { day: "수", date: "2026-02-04", emoji: null, label: null },
      { day: "목", date: "2026-02-05", emoji: null, label: null },
      { day: "금", date: "2026-02-06", emoji: null, label: null },
      { day: "토", date: "2026-02-07", emoji: null, label: null },
    ];
  }, [difficultyData]);

  const grassData = useMemo(() => {
    if (grassMapData?.grassMap) {
      return grassMapData.grassMap;
    }
    return generateDemoGrassData();
  }, [grassMapData]);

  const nickname = grassMapData?.nickname ?? "마들렌입니다다다";
  const totalCompletedTasks = grassMapData?.totalCompletedTasks ?? 2175;

  // 잔디맵을 주 단위로 그룹화
  const grassWeeks = useMemo(() => {
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

  const handleChecklistToggle = (id: number) => {
    setChecklist((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
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
      className="min-h-screen bg-white flex justify-center"
      style={{ fontFamily: "Pretendard" }}
    >
      <div
        className="w-full max-w-[1440px] min-h-screen bg-gray-100 p-6"
        style={{ borderRadius: "16px" }}
      >
        {/* 상단 3개 카드 */}
        <div className="flex gap-4 mb-4">
          {/* 요일별 계획 대비 완료율 */}
          <div
            className="bg-white shadow-sm border"
            style={{
              width: "280px",
              borderRadius: "16px",
              padding: "24px",
            }}
          >
            <h2
              className="text-lg font-bold text-[#0F1724] mb-6 text-left"
              style={{ fontFamily: "Pretendard" }}
            >
              요일별 계획 대비 완료율
            </h2>

            <div className="space-y-3">
              {weeklyCompletionData.map((item) => (
                <div key={item.day} className="flex items-center gap-3">
                  <span
                    className={`text-xs w-10 text-left ${
                      item.day === "일요일" || item.day === "토요일"
                        ? "text-red-500"
                        : "text-gray-600"
                    }`}
                  >
                    {item.day}
                  </span>
                  <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${item.rate}%`,
                        backgroundColor: "#8B5CF6",
                      }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 w-10 text-right">
                    {item.rate}%
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-6 text-xs text-gray-500 space-y-2 text-left">
              {analysisMessages.map((msg, idx) => (
                <p key={idx}>{msg}</p>
              ))}
            </div>
          </div>

          {/* TO:DAY 와 함께하고 있어요 */}
          <div
            className="bg-white shadow-sm border"
            style={{
              width: "280px",
              borderRadius: "16px",
              padding: "24px",
            }}
          >
            <h2
              className="text-lg font-bold text-[#0F1724] mb-6 text-left"
              style={{ fontFamily: "Pretendard" }}
            >
              TO:DAY 와 함께하고 있어요.
            </h2>

            <div className="flex gap-3 justify-center">
              {/* 총 일수 */}
              <div
                className="flex flex-col items-center justify-center"
                style={{
                  width: "110px",
                  height: "110px",
                  borderRadius: "16px",
                  background:
                    "linear-gradient(180deg, #FFFFFF 0%, #F8FCFF 64.44%, #B9DCFE 100%)",
                  boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.08)",
                }}
              >
                <span className="text-3xl font-bold text-[#0F1724]">
                  {totalDays}
                </span>
                <span className="text-xs text-gray-400 mt-1">총 일수</span>
              </div>

              {/* 연속 일수 */}
              <div
                className="flex flex-col items-center justify-center"
                style={{
                  width: "110px",
                  height: "110px",
                  borderRadius: "16px",
                  background:
                    "linear-gradient(180deg, #FFFFFF 0%, #DAE1E8 100%)",
                  boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.08)",
                }}
              >
                <span className="text-3xl font-bold text-[#0F1724]">
                  {consecutiveDays}
                </span>
                <span className="text-xs text-gray-400 mt-1">연속 일수</span>
              </div>
            </div>
          </div>

          {/* 일정 소화 난이도 성찰하기 */}
          <div
            className="bg-white shadow-sm border flex-1"
            style={{
              borderRadius: "16px",
              padding: "24px",
            }}
          >
            <h2
              className="text-lg font-bold text-[#0F1724] mb-4 text-left"
              style={{ fontFamily: "Pretendard" }}
            >
              일정 소화 난이도 성찰하기
            </h2>

            <div className="flex justify-between gap-2">
              {difficultyDays.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center gap-2 cursor-pointer"
                  onClick={() => handleDayClick(index)}
                >
                  <div
                    className={`flex items-center justify-center border-2 ${
                      index === todayIndex
                        ? "border-blue-400"
                        : "border-gray-200"
                    }`}
                    style={{
                      width: "70px",
                      height: "100px",
                      borderRadius: "12px",
                      background: item.emoji
                        ? getDifficultyGradient(item.label)
                        : index === todayIndex ? "#EBF5FF" : "#FFFFFF",
                    }}
                  >
                    {item.emoji ? (
                      <div className="flex flex-col items-center">
                        <span className="text-2xl">{item.emoji}</span>
                        <span
                          className="text-[9px] text-gray-600 mt-1"
                          style={{ fontFamily: "Pretendard" }}
                        >
                          {item.label}
                        </span>
                      </div>
                    ) : (
                      <Plus className="w-5 h-5 text-gray-300" />
                    )}
                  </div>
                  <span
                    className={`text-sm ${
                      index === todayIndex
                        ? "text-blue-500 font-medium"
                        : "text-gray-500"
                    }`}
                  >
                    {item.day}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 몰입을 방해하는 잡념 */}
        <div
          className="bg-white shadow-sm border relative mb-4"
          style={{
            borderRadius: "16px",
            padding: "24px",
          }}
        >
          <h2
            className="text-lg font-bold text-[#0F1724] mb-4 text-left"
            style={{ fontFamily: "Pretendard" }}
          >
            몰입을 방해하는 잡념과 할 일들을 적어보세요.
          </h2>

          <textarea
            value={distractionText}
            onChange={(e) => setDistractionText(e.target.value)}
            className="w-full p-4 text-sm text-gray-600 bg-gray-50 rounded-xl border-none resize-none focus:outline-none focus:ring-2 focus:ring-blue-200 text-left"
            style={{ fontFamily: "Pretendard", height: "100px" }}
            placeholder="몰입을 방해하는 생각이나 할 일들을 자유롭게 적어보세요..."
          />

          <div className="absolute bottom-6 right-6">
            <button
              onClick={handleDistractionSubmit}
              className="relative px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition"
              style={{ fontFamily: "Pretendard" }}
            >
              등록하기
              {pendingCount > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {pendingCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* 하단 2개 카드 */}
        <div className="flex gap-4">
          {/* 잔디맵 */}
          <div
            className="bg-white shadow-sm border"
            style={{
              flex: 1.5,
              borderRadius: "16px",
              padding: "24px",
            }}
          >
            <h2
              className="text-lg font-bold text-[#0F1724] mb-4 text-left"
              style={{ fontFamily: "Pretendard" }}
            >
              {nickname}님의 잔디, 이만큼 자랐어요!
            </h2>

            {/* Month labels */}
            <div className="flex mb-2 ml-4">
              {months.map((month, idx) => (
                <span
                  key={idx}
                  className="text-xs text-gray-400 flex-1"
                  style={{ fontFamily: "Pretendard" }}
                >
                  {month}
                </span>
              ))}
            </div>

            {/* Grass grid */}
            <div className="flex gap-[2px] overflow-hidden">
              {grassWeeks.map((week, weekIdx) => (
                <div key={weekIdx} className="flex flex-col gap-[2px]">
                  {week.map((day, dayIdx) => (
                    <div
                      key={dayIdx}
                      className="rounded-sm"
                      style={{
                        width: "12px",
                        height: "12px",
                        backgroundColor: getGrassColor(day.count),
                      }}
                      title={`${day.date}: ${day.count}개`}
                    />
                  ))}
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-end gap-2 mt-4">
              <span className="text-xs text-gray-400">적음</span>
              {[0, 2, 4, 7, 10].map((count, idx) => (
                <div
                  key={idx}
                  className="w-3 h-3 rounded-sm"
                  style={{ backgroundColor: getGrassColor(count) }}
                />
              ))}
              <span className="text-xs text-gray-400">많음</span>
            </div>

            <p
              className="text-center text-sm text-blue-500 mt-4"
              style={{ fontFamily: "Pretendard" }}
            >
              1년간 {totalCompletedTasks.toLocaleString()}개의 일정을 처리하셨어요!
            </p>
          </div>

          {/* 몰입 준비 체크리스트 */}
          <div
            className="bg-white shadow-sm border relative"
            style={{
              flex: 1,
              borderRadius: "16px",
              padding: "24px",
            }}
          >
            <h2
              className="text-lg font-bold text-[#0F1724] mb-4 text-left"
              style={{ fontFamily: "Pretendard" }}
            >
              몰입 준비 체크리스트
            </h2>

            <div className="space-y-3">
              {checklist.map((item) => (
                <label
                  key={item.id}
                  className="flex items-center gap-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition px-4 py-3"
                >
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition ${
                      item.checked
                        ? "bg-blue-500 border-blue-500"
                        : "border-gray-300 bg-white"
                    }`}
                    onClick={() => handleChecklistToggle(item.id)}
                  >
                    {item.checked && (
                      <Check className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <span
                    className={`text-sm ${
                      item.checked
                        ? "text-gray-400 line-through"
                        : "text-gray-700"
                    }`}
                    style={{ fontFamily: "Pretendard" }}
                  >
                    {item.text}
                  </span>
                </label>
              ))}
            </div>

            <p
              className="absolute bottom-4 right-6 text-gray-400"
              style={{ fontFamily: "Pretendard", fontSize: "10px" }}
            >
              매일 오전 6시에 갱신됩니다.
            </p>
          </div>
        </div>
      </div>

      {/* 이모지 선택 모달 */}
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
            style={{ width: "580px" }}
          >
            {/* 모달 헤더 */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-bold text-[#0F1724]" style={{ fontFamily: "Pretendard" }}>
                선택해주신 요일의 일정 소화 난이도를 알려주세요!
              </h3>
              <button
                onClick={() => {
                  setShowEmojiModal(false);
                  setSelectedEmoji(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 이모지 옵션들 */}
            <div className="px-6 py-6">
              <div className="flex justify-between gap-2">
                {emojiOptions.map((option) => (
                  <button
                    key={option.emoji}
                    onClick={() => handleEmojiSelect(option.emoji, option.label)}
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl transition relative ${
                      selectedEmoji?.emoji === option.emoji
                        ? "ring-2 ring-blue-500"
                        : ""
                    }`}
                    style={{
                      width: "70px",
                      height: "90px",
                      background: option.gradient,
                    }}
                  >
                    {selectedEmoji?.emoji === option.emoji && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                    <span className="text-2xl">{option.emoji}</span>
                    <span
                      className="text-[10px] text-gray-600 text-center leading-tight"
                      style={{ fontFamily: "Pretendard" }}
                    >
                      {option.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 확인 버튼 */}
            <div className="px-6 pb-6">
              <button
                onClick={handleConfirmEmoji}
                disabled={!selectedEmoji}
                className="w-full py-4 bg-blue-500 text-white text-base font-medium rounded-xl hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
                style={{ fontFamily: "Pretendard" }}
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
