import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getTextStyle } from "../../styles/auth/loginStyles";
import {
  getNotificationPreference,
  patchEditNotification,
} from "../../api/setting/notification";
import type {
  EditNotificationRequest,
  NotificationPreferenceResponse,
  EditNotificationResponse,
  NotificationPreferenceSuccessResponse,
  EditNotificationSuccessResponse,
} from "../../types/setting/notification";
import { getAccessToken } from "../../utils/tokenStorage";

type ToggleKey = "reminderAlert" | "kakaoAlert" | "emailAlert";

function Toggle({
  checked,
  onChange,
  disabled,
}: {
  checked: boolean;
  onChange: (changeTo: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      aria-pressed={checked}
      style={{
        width: "54px",
        height: "24px",
        borderRadius: "100px",
        background: checked ? "#2C2C2C" : "#3d3d3d3e",
        position: "relative",
        cursor: disabled ? "not-allowed" : "pointer",
      }}
    >
      <span
        style={{
          position: "absolute",
          top: "3px",
          left: checked ? "32px" : "3px",
          width: 18,
          height: 18,
          borderRadius: "50%",
          background: checked ? "#F5F5F5" : "#2f2f2fbb",
          transition: "left 120ms ease",
        }}
      />
    </button>
  );
}

function isSuccessData(
  res: NotificationPreferenceResponse,
): res is NotificationPreferenceSuccessResponse {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return typeof (res as any)?.data === "object" && (res as any).data !== null;
}

function isEditSuccess(
  res: EditNotificationResponse,
): res is EditNotificationSuccessResponse {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return typeof (res as any)?.isSuccess === "boolean";
}

export default function NotificationSettingPanel({
  goWithdraw,
}: {
  goWithdraw: () => void;
}) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const token = getAccessToken() || "";
  const [dto, setDto] = useState<EditNotificationRequest>({
    reminderAlert: false,
    kakaoAlert: false,
    emailAlert: false,
  });

  const [saveMsg, setSaveMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // 토큰 없으면 로그인
  useEffect(() => {
    if (!token) navigate("/login", { replace: true });
  }, [token, navigate]);

  // 알림 설정 데이터 불러오기
  const { data, isFetching } = useQuery({
    queryKey: ["me", "notificationPreference", token],
    queryFn: () => getNotificationPreference(token),
    enabled: !!token,
    staleTime: 0,
  });

  // 데이터 불러오면 dto 초기화
  useEffect(() => {
    if (!data) return;

    if (isSuccessData(data)) {
      setDto({
        reminderAlert: data.data.reminderAlert,
        kakaoAlert: data.data.kakaoAlert,
        emailAlert: data.data.emailAlert,
      });
      setErrorMsg(null);
    } else {
      setErrorMsg("알림 설정을 불러오지 못했습니다.");
    }
  }, [data]);

  const originData = useMemo(() => {
    if (!data) return null;
    if (!isSuccessData(data)) return null;
    return data.data;
  }, [data]);

  const isChanged = useMemo(() => {
    if (!originData) return false;
    return (
      dto.reminderAlert !== originData.reminderAlert ||
      dto.kakaoAlert !== originData.kakaoAlert ||
      dto.emailAlert !== originData.emailAlert
    );
  }, [dto, originData]);

  const editNotificationMutation = useMutation({
    mutationFn: () => patchEditNotification(token, dto),
    onSuccess: (result) => {
      if (isEditSuccess(result) && result.isSuccess) {
        setErrorMsg(null);
        setSaveMsg("저장되었습니다.");

        setTimeout(() => {
          setSaveMsg(null);
        }, 4000);

        queryClient.invalidateQueries({
          queryKey: ["me", "notificationPreference", token],
        });
      }
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      setSaveMsg(null);
      setErrorMsg("저장에 실패했습니다.");
      console.error("알림 설정 저장 에러 상세:", error.response?.data);
    },
  });

  const isLoading = isFetching || editNotificationMutation.isPending;

  function toggle(key: ToggleKey, changeTo: boolean) {
    setDto((prev) => ({ ...prev, [key]: changeTo }));
    setSaveMsg(null);
    setErrorMsg(null);
  }

  function onClickWithdraw() {
    goWithdraw();
  }

  function onClickSave() {
    setSaveMsg(null);
    setErrorMsg(null);

    if (!isChanged || isLoading) return;
    editNotificationMutation.mutate();
  }

  const canSave = isChanged && !isLoading;

  return (
    <div>
      <div
        style={{ position: "relative", height: "480px", overflow: "hidden" }}
      >
        <div
          style={{
            ...getTextStyle(500, 16, "#6987D2"),
            marginTop: "20px",
            marginBottom: "44px",
          }}
        >
          알림 설정
        </div>

        {/* 설정 목록 */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "220px 1fr",
            rowGap: 22,
            alignItems: "center",
            paddingLeft: 6,
            paddingRight: 30,
          }}
        >
          <div style={getTextStyle(450, 15, "#525050")}>리마인드 알림</div>
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <Toggle
              checked={dto.reminderAlert}
              onChange={(v) => toggle("reminderAlert", v)}
              disabled={isLoading}
            />
          </div>

          <div style={getTextStyle(450, 15, "#525050")}>카카오톡 채널 알림</div>
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <Toggle
              checked={dto.kakaoAlert}
              onChange={(v) => toggle("kakaoAlert", v)}
              disabled={isLoading}
            />
          </div>

          <div style={getTextStyle(450, 15, "#525050")}>이메일 알림</div>
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <Toggle
              checked={dto.emailAlert}
              onChange={(v) => toggle("emailAlert", v)}
              disabled={isLoading}
            />
          </div>
        </div>

        {/* 저장 or 에러 메시지 */}
        {(saveMsg || errorMsg) && (
          <div
            style={{
              marginTop: "210px",
              marginRight: "30px",
              textAlign: "right",
              fontSize: "13px",
              fontWeight: 600,
              color: saveMsg ? "#0066FF" : "#D93025",
              whiteSpace: "pre-line",
            }}
          >
            {saveMsg || errorMsg}
          </div>
        )}
      </div>

      {/* 하단 버튼 (회원탈퇴, 저장) */}
      <div
        style={{
          position: "absolute",
          left: "220px",
          right: 0,
          bottom: 0,
          padding: "20px 28px",
          borderTop: "1px solid #EAEAEA",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: "15px",
          background: "#FFFFFF",
        }}
      >
        <button
          type="button"
          onClick={onClickWithdraw}
          disabled={isLoading}
          style={{
            height: "38px",
            width: "100px",
            borderRadius: "12px",
            border: "1px solid #E54D52",
            background: "#FFFFFF",
            color: "#E54D52",
            fontWeight: 600,
            fontSize: "14px",
            cursor: isLoading ? "not-allowed" : "pointer",
          }}
        >
          회원탈퇴
        </button>

        <button
          type="button"
          onClick={onClickSave}
          disabled={!canSave}
          style={{
            height: "38px",
            width: "100px",
            borderRadius: "12px",
            background: canSave ? "#3182F6" : "#5C92FF",
            color: "#FFFFFF",
            fontWeight: 600,
            fontSize: "14px",
            cursor: canSave ? "pointer" : "not-allowed",
          }}
        >
          저장
        </button>
      </div>
    </div>
  );
}
