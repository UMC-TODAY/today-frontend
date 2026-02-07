import ProfileSummaryCard from "../components/dashboard/ProfileSummaryCard.tsx";
import CategoryStatsCard from "../components/dashboard/CategoryStatsCard.tsx";
import ActivityHeatmap from "../components/dashboard/ActivityHeatmap.tsx";
import TodoList from "../components/goalTracker/TodoList.tsx";
import ScheduleList from "../components/calendar/ScheduleList.tsx";

const cardStyle: React.CSSProperties = {
  borderRadius: "12px",
  background: "#fff",
  border: "2px solid #f3f3f3",
  minHeight: 0,
};

export default function DashboardPage() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      {/* 헤더 */}
      <div style={{ marginBottom: "30px" }}>
        <h1
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            textAlign: "left",
            margin: 0,
          }}
        >
          대시보드
        </h1>
      </div>

      <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
        {/* 메인 컨텐츠 영역 시작 */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "16px",
            flex: 1,
            minHeight: 0,
          }}
        >
          {/* 왼쪽 : 사이드 패널 */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              minHeight: 0,
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
              }}
            >
              {/* */}
              <div
                style={{
                  ...cardStyle,
                  flex: 18,
                  marginBottom: "12px",
                  alignItems: "center",
                  justifyContent: "center",
                  display: "flex",
                }}
              >
                <ProfileSummaryCard />
              </div>

              {/* */}
              <div
                style={{
                  ...cardStyle,
                  flex: 9,
                  marginBottom: "12px",
                  alignItems: "center",
                  justifyContent: "center",
                  display: "flex",
                }}
              >
                <CategoryStatsCard />
              </div>

              {/* */}
              <div
                style={{
                  ...cardStyle,
                  flex: 12,
                  alignItems: "center",
                  justifyContent: "center",
                  display: "flex",
                }}
              >
                <ActivityHeatmap />
              </div>
            </div>
          </div>

          {/* 중앙 : 할 일 리스트 */}
          <div
            style={{
              ...cardStyle,
              flex: 2,
              alignItems: "center",
              justifyContent: "center",
              display: "flex",
            }}
          >
            <TodoList />
          </div>

          {/* 오른쪽 : 일정 리스트 */}
          <div
            style={{
              ...cardStyle,
              flex: 2,
              alignItems: "center",
              justifyContent: "center",
              display: "flex",
            }}
          >
            <ScheduleList />
          </div>
        </div>
        {/* 메인 컨텐츠 영역 끝 */}
      </div>
    </div>
  );
}
