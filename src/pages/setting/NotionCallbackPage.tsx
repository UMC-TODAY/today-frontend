import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { getNotionCallback } from "../../api/setting/calendar";
import { authCommenStyles as s } from "../../styles/auth/authCommonStyles";
import { getTextStyle } from "../../styles/auth/loginStyles";
import { getAccessToken } from "../../utils/tokenStorage";

function useQueryParams() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

export default function NotionCallbackPage() {
  const navigate = useNavigate();
  const qs = useQueryParams();

  const token = getAccessToken() || "";

  const code = qs.get("code") || "";
  const state = qs.get("state") || "";

  const [msg, setMsg] = useState("Notion 연동 처리 중...");

  const alreadyDoneRef = useRef(false);

  const NotionCallbackMutation = useMutation({
    mutationFn: () => getNotionCallback(token, code, state),
    onSuccess: (result) => {
      if (result.isSuccess) {
        setMsg("Notion 연동이 완료되었습니다.");

        // 연동 완료 메시지 1초 띄우고 화면 전환
        setTimeout(() => {
          navigate("/dashboard?settings=calendar", { replace: true });
        }, 1000);
        return;
      }
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      setMsg("Notion 연동에 실패했습니다.");
      console.error("Notion callback 에러 상세:", error?.response?.data);
    },
  });

  useEffect(() => {
    if (!code) {
      setMsg("code가 존재하지 않습니다.");
      return;
    }

    if (!state) {
      setMsg("state가 존재하지 않습니다.");
      return;
    }

    if (alreadyDoneRef.current) return;
    alreadyDoneRef.current = true;

    NotionCallbackMutation.mutate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code, state]);

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
