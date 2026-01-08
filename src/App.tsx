import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import ProtectedRoute from './components/layout/ProtectedRoute';
import LoginPage from './pages/auth/LoginPage';
import DashboardPage from './pages/DashboardPage';
import CalendarPage from './pages/CalendarPage';
import GoalTrackerPage from './pages/GoalTrackerPage';
import CommunityPage from './pages/CommunityPage';
import AnalyticsPage from './pages/AnalyticsPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 로그인 페이지 - 인증 불필요 */}
        <Route path="/login" element={<LoginPage />} />

        {/* 메인 앱 - 인증 필요 + 사이드바 레이아웃 */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          {/* 기본 경로는 대시보드로 리다이렉트 */}
          <Route index element={<Navigate to="/dashboard" replace />} />

          {/* 각 페이지들 */}
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="calendar" element={<CalendarPage />} />
          <Route path="goal-tracker" element={<GoalTrackerPage />} />
          <Route path="community" element={<CommunityPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
        </Route>

        {/* 404 페이지 등 - 홈으로 리다이렉트 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
