import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ACCESS_TOKEN_KEY = "accessToken";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const navigate = useNavigate();

  useEffect(() => {
    const auth =
      sessionStorage.getItem(ACCESS_TOKEN_KEY) || localStorage.getItem(ACCESS_TOKEN_KEY);

    if (!auth) {
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  return <>{children}</>;
}