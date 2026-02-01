import React, { useState } from "react";
import { Plus, Check } from "lucide-react";

// 요일별 완료율 데이터 (데모용)
const weeklyCompletionData = [
  { day: "일요일", rate: 32, color: "#EF4444" },
  { day: "월요일", rate: 100, color: "#3B82F6" },
  { day: "화요일", rate: 47, color: "#3B82F6" },
  { day: "수요일", rate: 72, color: "#3B82F6" },
  { day: "목요일", rate: 30, color: "#3B82F6" },
  { day: "금요일", rate: 56, color: "#3B82F6" },
  { day: "토요일", rate: 42, color: "#EF4444" },
];

// 난이도 이모지 데이터
const difficultyDays = [
  { day: "일", emoji: null, selected: false },
  { day: "월", emoji: "🥵", label: "어려움", selected: false },
  { day: "화", emoji: "🥵", label: "어려움", selected: false },
  { day: "수", emoji: null, selected: true },
  { day: "목", emoji: null, selected: false },
  { day: "금", emoji: null, selected: false },
  { day: "토", emoji: null, selected: false },
];

// 잔디 그래프 데이터 생성 (데모용)
const generateGrassData = () => {
  const months = ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan"];
  const weeks = 52;
  const days = 7;
  const data: number[][] = [];

  for (let w = 0; w < weeks; w++) {
    const week: number[] = [];
    for (let d = 0; d < days; d++) {
      // 최근 주일수록 더 활발하게
      if (w > 45) {
        week.push(Math.floor(Math.random() * 5));
      } else {
        week.push(Math.floor(Math.random() * 3));
      }
    }
    data.push(week);
  }
  return { months, data };
};

const grassData = generateGrassData();

// 체크리스트 아이템
const checklistItems = [
  { id: 1, text: "필요한 참고 자료 탭만 열기", checked: false },
  { id: 2, text: "휴대폰 무음 및 뒤집기", checked: false },
  { id: 3, text: "물 또는 음료 준비하기", checked: false },
  { id: 4, text: "완료할 일정 정하기", checked: false },
];

// 잔디 색상
const getGrassColor = (level: number) => {
  const colors = [
    "#EBEDF0", // 0 - 없음
    "#C6E0F5", // 1 - 적음
    "#9EC5E8", // 2
    "#6B9BD1", // 3
    "#4A7DC4", // 4 - 많음
  ];
  return colors[level] || colors[0];
};

export default function AnalyticsPage() {
  const [distractionText, setDistractionText] = useState(
    "이번주는 너무 할일이 많았고, 같은 처리 방식을 가진 일이 하루안에 몰려있지 않고, 다양하게 처리해야하는 업무 부분, 일상 부분, 취미 부분이 하루에 다 몰려있어서 몰입하기 어려웠습니다."
  );
  const [checklist, setChecklist] = useState(checklistItems);
  const pendingCount = 1; // 등록 대기 중인 항목 수

  const handleChecklistToggle = (id: number) => {
    setChecklist(prev =>
      prev.map(item =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-[1200px] mx-auto space-y-4">
        {/* Top Row - 3 Cards */}
        <div className="grid grid-cols-3 gap-4">
          {/* 요일별 계획 대비 완료율 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-[#0F1724] mb-6" style={{ fontFamily: "Pretendard" }}>
              요일별 계획 대비 완료율
            </h2>

            <div className="space-y-3">
              {weeklyCompletionData.map((item) => (
                <div key={item.day} className="flex items-center gap-3">
                  <span
                    className={`text-xs w-12 ${item.day === "일요일" || item.day === "토요일" ? "text-red-500" : "text-gray-600"}`}
                    style={{ fontFamily: "Pretendard" }}
                  >
                    {item.day}
                  </span>
                  <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${item.rate}%`,
                        backgroundColor: item.day === "일요일" || item.day === "토요일" ? "#EF4444" : "#3B82F6",
                      }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 w-10 text-right" style={{ fontFamily: "Pretendard" }}>
                    {item.rate}%
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-6 text-xs text-gray-500 space-y-2" style={{ fontFamily: "Pretendard" }}>
              <p>요일별로 계획 유지 비율의 차이가 나타납니다.</p>
              <p>월요일, 수요일에는 계획 대비 완료 비율이 높은 편입니다.<br/>
              목요일, 일요일에는 계획한 일정이 일부 완료되지 않는 경우가 많았습니다.</p>
              <p>완료율이 높은 월요일의 일정 구성을 참고해보세요.</p>
            </div>
          </div>

          {/* TO:DAY 와 함께하고 있어요 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-[#0F1724] mb-6" style={{ fontFamily: "Pretendard" }}>
              TO:DAY 와 함께하고 있어요.
            </h2>

            <div className="flex gap-4">
              <div className="flex-1 bg-gray-50 rounded-xl p-6 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-[#0F1724]" style={{ fontFamily: "Pretendard" }}>
                  365
                </span>
                <span className="text-sm text-gray-400 mt-2" style={{ fontFamily: "Pretendard" }}>
                  총 일수
                </span>
              </div>
              <div className="flex-1 bg-blue-50 rounded-xl p-6 flex flex-col items-center justify-center border-2 border-blue-200">
                <span className="text-4xl font-bold text-[#0F1724]" style={{ fontFamily: "Pretendard" }}>
                  20
                </span>
                <span className="text-sm text-gray-400 mt-2" style={{ fontFamily: "Pretendard" }}>
                  연속 일수
                </span>
              </div>
            </div>
          </div>

          {/* 일정 소화 난이도 성찰하기 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-[#0F1724] mb-6" style={{ fontFamily: "Pretendard" }}>
              일정 소화 난이도 성찰하기
            </h2>

            <div className="flex justify-between">
              {difficultyDays.map((item, index) => (
                <div key={index} className="flex flex-col items-center gap-2">
                  <div
                    className={`w-14 h-14 rounded-xl flex items-center justify-center border-2 ${
                      item.selected ? "border-blue-400 bg-blue-50" : "border-gray-200 bg-white"
                    }`}
                  >
                    {item.emoji ? (
                      <div className="flex flex-col items-center">
                        <span className="text-2xl">{item.emoji}</span>
                        <span className="text-[8px] text-gray-500 bg-gray-100 px-1 rounded mt-0.5">
                          {item.label}
                        </span>
                      </div>
                    ) : (
                      <Plus className="w-5 h-5 text-gray-300" />
                    )}
                  </div>
                  <span
                    className={`text-sm ${item.selected ? "text-blue-500 font-medium" : "text-gray-500"}`}
                    style={{ fontFamily: "Pretendard" }}
                  >
                    {item.day}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 몰입을 방해하는 잡념과 할 일들 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm relative">
          <h2 className="text-lg font-bold text-[#0F1724] mb-4" style={{ fontFamily: "Pretendard" }}>
            몰입을 방해하는 잡념과 할 일들을 적어보세요.
          </h2>

          <textarea
            value={distractionText}
            onChange={(e) => setDistractionText(e.target.value)}
            className="w-full h-24 p-4 text-sm text-gray-600 bg-gray-50 rounded-xl border-none resize-none focus:outline-none focus:ring-2 focus:ring-blue-200"
            style={{ fontFamily: "Pretendard" }}
            placeholder="몰입을 방해하는 생각이나 할 일들을 자유롭게 적어보세요..."
          />

          {/* 등록하기 버튼 */}
          <div className="absolute bottom-4 right-4">
            <button className="relative px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition" style={{ fontFamily: "Pretendard" }}>
              등록하기
              {pendingCount > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {pendingCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Bottom Row - 2 Cards */}
        <div className="grid grid-cols-2 gap-4">
          {/* 잔디 그래프 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-[#0F1724] mb-4" style={{ fontFamily: "Pretendard" }}>
              마들렌입니다다다님의 잔디, 이만큼 자랐어요!
            </h2>

            {/* Month labels */}
            <div className="flex mb-2 ml-4">
              {grassData.months.map((month, idx) => (
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
            <div className="flex gap-[2px]">
              {grassData.data.map((week, weekIdx) => (
                <div key={weekIdx} className="flex flex-col gap-[2px]">
                  {week.map((level, dayIdx) => (
                    <div
                      key={dayIdx}
                      className="w-3 h-3 rounded-sm"
                      style={{ backgroundColor: getGrassColor(level) }}
                    />
                  ))}
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-end gap-2 mt-4">
              <span className="text-xs text-gray-400" style={{ fontFamily: "Pretendard" }}>적음</span>
              {[0, 1, 2, 3, 4].map((level) => (
                <div
                  key={level}
                  className="w-3 h-3 rounded-sm"
                  style={{ backgroundColor: getGrassColor(level) }}
                />
              ))}
              <span className="text-xs text-gray-400" style={{ fontFamily: "Pretendard" }}>많음</span>
            </div>

            <p className="text-center text-sm text-blue-500 mt-4" style={{ fontFamily: "Pretendard" }}>
              1년간 2,175개의 일정을 처리하셨어요!
            </p>
          </div>

          {/* 몰입 준비 체크리스트 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm relative">
            <h2 className="text-lg font-bold text-[#0F1724] mb-4" style={{ fontFamily: "Pretendard" }}>
              몰입 준비 체크리스트
            </h2>

            <div className="space-y-3">
              {checklist.map((item) => (
                <label
                  key={item.id}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition"
                >
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition ${
                      item.checked
                        ? "bg-blue-500 border-blue-500"
                        : "border-gray-300 bg-white"
                    }`}
                    onClick={() => handleChecklistToggle(item.id)}
                  >
                    {item.checked && <Check className="w-4 h-4 text-white" />}
                  </div>
                  <span
                    className={`text-sm ${item.checked ? "text-gray-400 line-through" : "text-gray-700"}`}
                    style={{ fontFamily: "Pretendard" }}
                  >
                    {item.text}
                  </span>
                </label>
              ))}
            </div>

            <p className="absolute bottom-4 right-4 text-xs text-gray-400" style={{ fontFamily: "Pretendard" }}>
              매일 오전 6시에 갱신됩니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
