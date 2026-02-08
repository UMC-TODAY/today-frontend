import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { authCommenStyles as s } from "../../styles/auth/authCommonStyles";
import { getTextStyle } from "../../styles/auth/loginStyles";
import {
  getGoogleCallback,
  getIntegrationStatus,
} from "../../api/setting/calendar";
import { getAccessToken } from "../../utils/tokenStorage";

function useQueryParams() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

export default function GoogleCallbackPage() {
  const navigate = useNavigate();
  const qs = useQueryParams();

  const token = getAccessToken() || "";

  const code = qs.get("code") || "";

  const [msg, setMsg] = useState("Google 연동 처리 중...");

  const alreadyDoneRef = useRef(false);

  const googleCallbackMutation = useMutation({
    mutationFn: () => getGoogleCallback(token, code),
    onSuccess: (result) => {
      if (result.isSuccess) {
        integrationStatusMutation.mutate();
      }
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      setMsg("Google 연동에 실패했습니다.");
      console.error("Google callback 에러 상세:", error?.response?.data);
    },
  });

  const integrationStatusMutation = useMutation({
    mutationFn: getIntegrationStatus,
    onSuccess: (result) => {
      if (result.isSuccess) {
        const googleStatus = result.data?.providers.find(
          (p) => p.provider === "GOOGLE",
        );

        if (googleStatus?.connected) {
          setMsg("Google 연동이 완료되었습니다.");

          // 연동 완료 메시지 1.5초 띄우고 화면 전환
          setTimeout(() => {
            navigate("/dashboard?settings=calendar", { replace: true });
          }, 1500);
          return;
        } else {
          setMsg("Google 연동에 실패했습니다.");
        }
      }
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      setMsg("Google 연동에 실패했습니다.");
      console.error("Google callback 에러 상세:", error?.response?.data);
    },
  });

  useEffect(() => {
    if (!code) {
      setMsg("code가 존재하지 않습니다.");
      return;
    }

    if (alreadyDoneRef.current) return;
    alreadyDoneRef.current = true;

    googleCallbackMutation.mutate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

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
}
