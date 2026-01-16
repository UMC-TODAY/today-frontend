import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AUTH_KEY = "today_auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const navigate = useNavigate();

  useEffect(() => {
    // 로그인 체크 (localStorage 사용 예시)
    const auth =
      sessionStorage.getItem(AUTH_KEY) || localStorage.getItem(AUTH_KEY);

    if (!auth) {
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  return <>{children}</>;
}