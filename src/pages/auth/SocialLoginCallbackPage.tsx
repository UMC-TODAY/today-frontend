import { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { authCommenStyles as s } from "../../styles/auth/authCommonStyles";
import { getTextStyle } from "../../styles/auth/loginStyles";

interface Props {
    provider: "naver" | "google";
}

function useQueryParams() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

const SocialLoginCallbackPage = ({ provider }: Props) => {
  const navigate = useNavigate();
  const qs = useQueryParams();

  const accessToken = qs.get("accessToken");

  const providerName = provider === "naver" ? "네이버" : "구글";
  const [msg, setMsg] = useState(`${providerName} 계정 연동 처리 중...`);

  useEffect(() => {
    if (accessToken) {
      localStorage.setItem("accessToken", accessToken);
      setMsg(`${providerName} 연동이 완료되었습니다.`)

      // 연동 상태 메시지 1초 띄우고 화면 전환
      const timer = setTimeout(() => {
        navigate("/dashboard");
      }, 2000);

      return () => clearTimeout(timer);
    } else {
      // 토큰이 없는 경우 로그인 페이지로 리다이렉트
      setMsg("로그인에 실패하였습니다.");

      const errorTimer = setTimeout(() => {
        navigate("/login");
      }, 2000);

      return () => clearTimeout(errorTimer);
    }
  }, [accessToken, providerName, navigate]);

  return (
    <div style={s.page}>
      <div
        style={{
          width: "500px",
          height: "240px",
          background: "#FFFFFF",
          borderRadius: "12px",
          padding: "30px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={getTextStyle(600, 16, "#000000")}>{msg}</div>
      </div>
    </div>
  );
};

export default SocialLoginCallbackPage;
