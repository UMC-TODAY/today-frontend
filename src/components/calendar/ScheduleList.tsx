import { useState } from "react";
import { useGetMonthlySchedule } from "../../hooks/queries/useSchedule";

export default function ScheduleList() {
  // 조회할 연도/월 상태 관리
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(1);
  // 숨기기 상태
  const [hidePast, setHidePast] = useState(false);

  const { data: response, isLoading } = useGetMonthlySchedule({
    year: year,
    month: month,
    filter: "ALL", // TODO: 필터값 나중에 연결하기 드롭다운 만들어서
    hidePast: hidePast,
  });

  const scheduleList = response?.data?.events || [];

  // 이전 달로 이동 핸들러 (1월에서 누르면 작년 12월로)
  const handlePrevMonth = () => {
    if (month === 1) {
      setYear((prev) => prev - 1);
      setMonth(12);
    } else {
      setMonth((prev) => prev - 1);
    }
  };
  // 다음 달로 이동 핸들러 (12월에서 누르면 내년 1월로)
  const handleNextMonth = () => {
    if (month === 12) {
      setYear((prev) => prev + 1);
      setMonth(1);
    } else {
      setMonth((prev) => prev + 1);
    }
  };

  // 지난 일정 숨기기

  if (isLoading) return <div>로딩 중...</div>;

  return (
    <div>
      {/* 연/월 조작 버튼 */}
      <div style={{ marginBottom: "10px" }}>
        <button onClick={() => handlePrevMonth()}>◀</button>
        <span style={{ margin: "0 10px" }}>
          {year}년 {month}월
        </span>
        <button onClick={() => handleNextMonth()}>▶</button>
      </div>

      {scheduleList.length === 0 ? <div>일정이 없습니다.</div> : null}

      <button onClick={() => setHidePast(!hidePast)}>
        {hidePast ? "지난 일정 다시 보기" : "지난 일정 숨기기"}
      </button>

      {/* 리스트 렌더링 */}
      {scheduleList.map((schedule) => (
        <div
          key={schedule.id}
          style={{
            border: "1px solid #ddd",
            margin: "5px",
            padding: "10px",
            display: "flex",
            alignItems: "center",
            gap: "5px",
          }}
        >
          <span>{schedule.emoji}</span>
          <span>{schedule.startedAt.split(" ")[0]}</span>
          <strong>{schedule.title}</strong>
        </div>
      ))}
    </div>
  );
}
