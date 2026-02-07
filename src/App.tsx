import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import LoginPage from "./pages/auth/LoginPage";
import LoginHelpPage from "./pages/auth/LoginHelpPage";
import FindIdPage from "./pages/auth/FindIdPage";
import FindPasswordPage from "./pages/auth/FindPasswordPage";
import FindPasswordVerifyPage from "./pages/auth/FindPasswordVerifyPage";
import FindPasswordDonePage from "./pages/auth/FindPasswordDonePage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import SignupPage from "./pages/auth/SignupPage";
import SignupPasswordPage from "./pages/auth/SignupPasswordPage";
import DashboardPage from "./pages/DashboardPage";
import CalendarPage from "./pages/CalendarPage";
import GoalTrackerPage from "./pages/GoalTrackerPage";
import CommunityPage from "./pages/CommunityPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import "./App.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import WithdrawPage from "./pages/setting/WithdrawPage";
import ICloudIntegrationPage from "./pages/setting/ICloudIntegrationPage";
import NotionCallbackPage from "./pages/setting/NotionCallbackPage";
import GoogleCallbackPage from "./pages/setting/GoogleCallbackPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      gcTime: 1000 * 60 * 5,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-right" />
      <BrowserRouter>
        <Routes>
          {/* 로그인 페이지 - 인증 불필요 */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/login/help" element={<LoginHelpPage />} />
          <Route path="/login/find-id" element={<FindIdPage />} />
          <Route path="/login/find-password" element={<FindPasswordPage />} />
          <Route
            path="/login/find-password/verify"
            element={<FindPasswordVerifyPage />}
          />
          <Route
            path="/login/find-password/done"
            element={<FindPasswordDonePage />}
          />
          <Route path="/login/reset-password" element={<ResetPasswordPage />} />

          <Route path="/signup" element={<SignupPage />} />
          <Route path="/signup/password" element={<SignupPasswordPage />} />

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

            {/* 설정 -> 탈퇴 페이지 */}
            <Route path="setting/withdraw" element={<WithdrawPage />} />
            <Route path="setting/calendar/icloud" element={<ICloudIntegrationPage />} />
            <Route path="setting/calendar/notion/callback" element={<NotionCallbackPage />} />
            <Route path="setting/calendar/google/callback" element={<GoogleCallbackPage />} />
          </Route>

          {/* 404 페이지 등 - 홈으로 리다이렉트 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
