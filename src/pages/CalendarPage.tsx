import CalendarView from "../components/calendar/CalendarView.tsx";
import ScheduleList from "../components/calendar/ScheduleList.tsx";
import MonthlyScheduleSummary from "../components/calendar/MonthlyScheduleSummary.tsx";

const cardStyle: React.CSSProperties = {
  borderRadius: "12px",
  background: "#fff",
  border: "2px solid #f3f3f3",
  minHeight: 0,
};

export default function CalendarPage() {
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* 헤더 */}
      <div style={{ marginBottom: "30px" }}>
        <h1
          style={{
            fontSize: "28px",
            fontWeight: "bold",
            textAlign: "left",
            margin: 0,
          }}
        >
          캘린더
        </h1>
      </div>

      {/* 메인 컨텐츠 영역 */}
      <div
        style={{
          display: "flex",
          gap: "20px",
          flex: 1,
          minHeight: 0,
        }}
      >
        {/* 왼쪽: 캘린더 영역 */}
        <div
          style={{
            ...cardStyle,
            flex: 3,
            alignItems: "center",
            justifyContent: "center",
            display: "flex",
          }}
        >
          <CalendarView />
        </div>

        {/* 오른쪽: 사이드 패널 */}
        <div
          style={{
            flex: 2,
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          {/* 이번달 달성 현황 */}
          <div
            style={{
              ...cardStyle,
              padding: "24px",
              height: "160px",
              alignItems: "center",
              justifyContent: "center",
              display: "flex",
            }}
          >
            <MonthlyScheduleSummary />
          </div>

          {/* 일정 리스트 */}
          <div
            style={{
              ...cardStyle,
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              display: "flex",
            }}
          >
            <ScheduleList />
          </div>
        </div>
      </div>
    </div>
  );
}
