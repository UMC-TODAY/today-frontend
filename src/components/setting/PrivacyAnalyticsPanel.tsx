import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTextStyle } from "../../styles/auth/loginStyles";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  type EditPrivacyInfoRequest,
  type EditPrivacyInfoResponse,
  type EditPrivacyInfoSuccessResponse,
  type PrivacyInfoResponse,
  type PrivacyInfoSuccessResponse,
} from "../../types/setting/privacy";
import {
  getPrivacyInfo,
  patchEditPrivacyInfo,
} from "../../api/setting/privacy";
import { getAccessToken } from "../../utils/tokenStorage";

type ShareScope = "FRIEND" | "PRIVATE";

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

function SegmentButton({
  value,
  onChange,
  disabled,
}: {
  value: ShareScope;
  onChange: (v: ShareScope) => void;
  disabled?: boolean;
}) {
  const commonBase: React.CSSProperties = {
    height: "34px",
    width: "120px",
    borderRadius: "9px",
    fontSize: "13px",
    fontWeight: 400,
    cursor: disabled ? "not-allowed" : "pointer",
  };

  const activeButton: React.CSSProperties = {
    background: "#FFFFFF",
    color: "#5C5858",
  };

  const inactiveButton: React.CSSProperties = {
    background: "#EFEFEF",
    color: "#8D8D8D",
  };

  return (
    <div
      style={{
        display: "inline-flex",
        width: "240px",
        padding: "4px",
        borderRadius: "12px",
        background: "#EFEFEF",
      }}
    >
      <button
        type="button"
        disabled={disabled}
        onClick={() => onChange("FRIEND")}
        style={{
          ...commonBase,
          ...(value === "FRIEND" ? activeButton : inactiveButton),
        }}
      >
        친구 공개
      </button>
      <button
        type="button"
        disabled={disabled}
        onClick={() => onChange("PRIVATE")}
        style={{
          ...commonBase,
          ...(value === "PRIVATE" ? activeButton : inactiveButton),
        }}
      >
        비공개
      </button>
    </div>
  );
}

function isSuccessData(
  res: PrivacyInfoResponse,
): res is PrivacyInfoSuccessResponse {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return typeof (res as any)?.data === "object" && (res as any)?.data !== null;
}

function isEditSuccess(
  res: EditPrivacyInfoResponse,
): res is EditPrivacyInfoSuccessResponse {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return typeof (res as any)?.isSuccess === "boolean";
}

export default function PrivacyAnalyticsSettingPanel({
  goWithdraw,
}: {
  goWithdraw: () => void;
}) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const token = getAccessToken() || "";
  const [dto, setDto] = useState<EditPrivacyInfoRequest>({
    privacyScope: "FRIEND" as ShareScope,
    dataUse: true,
  });

  const [saveMsg, setSaveMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // 토큰 없으면 로그인
  useEffect(() => {
    if (!token) navigate("/login", { replace: true });
  }, [token, navigate]);

  // 개인정보 및 분석설정 데이터 불러오기
  const { data, isFetching } = useQuery({
    queryKey: ["me", "privacyAnalyticsPreference", token],
    queryFn: () => getPrivacyInfo(token),
    enabled: !!token,
    staleTime: 0,
  });

  // 데이터 불러오면 dto 초기화
  useEffect(() => {
    if (!data) return;

    if (isSuccessData(data)) {
      setDto({
        privacyScope: data.data.privacyScope,
        dataUse: data.data.dataUse,
      });
      setErrorMsg(null);
    } else {
      setErrorMsg("개인정보 및 분석설정 데이터를 불러오지 못했습니다.");
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
      dto.privacyScope !== originData.privacyScope ||
      dto.dataUse !== originData.dataUse
    );
  }, [dto, originData]);

  const editPrivacyMutation = useMutation({
    mutationFn: () => patchEditPrivacyInfo(token, dto),
    onSuccess: (result) => {
      if (isEditSuccess(result) && result.isSuccess) {
        setErrorMsg(null);
        setSaveMsg("저장되었습니다.");

        setTimeout(() => {
          setSaveMsg(null);
        }, 4000);

        queryClient.invalidateQueries({
          queryKey: ["me", "privacyAnalyticsPreference", token],
        });
      }
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      setSaveMsg(null);
      setErrorMsg("저장에 실패했습니다.");
      console.error(
        "개인정보 및 분석 설정 저장 에러 상세:",
        error.response?.data,
      );
    },
  });

  const isLoading = isFetching || editPrivacyMutation.isPending;

  function onClickWithdraw() {
    goWithdraw();
  }

  function onClickSave() {
    setSaveMsg(null);
    setErrorMsg(null);

    if (!isChanged || isLoading) return;
    editPrivacyMutation.mutate();
  }

  const canSave = isChanged && !isLoading;

  function onClickInformation() {
    alert("내 일정 학습 데이터 활용 동의 링크는 추후 연결 예정입니다.");
  }

  function onClickPrivacyPolicy() {
    alert("개인정보 처리방침 링크는 추후 연결 예정입니다.");
  }

  function onClickServiceTerms() {
    alert("서비스 이용 약관 링크는 추후 연결 예정입니다.");
  }

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
          개인정보 및 분석 설정
        </div>

        {/* 일정 공유 범위 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            paddingLeft: "6px",
            paddingRight: "30px",
            marginBottom: "45px",
          }}
        >
          <div
            style={{
              ...getTextStyle(450, 15, "#525050"),
              marginBottom: "16px",
              marginRight: "20px",
            }}
          >
            일정 공유 범위
          </div>

          <SegmentButton
            value={dto.privacyScope as ShareScope}
            onChange={(v) => {
              setDto({ ...dto, privacyScope: v });
              setSaveMsg(null);
            }}
            disabled={isLoading}
          />
        </div>

        {/* 내 일정 학습 데이터 활용 동의 */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto",
            alignItems: "center",
            marginTop: "26px",
            paddingLeft: "6px",
          }}
        >
          <div style={{ display: "flex", gap: "20px", marginBottom: "16px" }}>
            <div style={getTextStyle(350, 13, "#525050")}>
              내 일정 학습 데이터 활용 동의
            </div>
            <Toggle
              checked={dto.dataUse}
              onChange={(v) => {
                setDto({ ...dto, dataUse: v });
                setSaveMsg(null);
              }}
              disabled={isLoading}
            />
          </div>

          <button
            type="button"
            onClick={onClickInformation}
            disabled={isLoading}
            style={{
              ...getTextStyle(350, 13, "#525050"),
              gridColumn: "1 / 3",
              lineHeight: 1.5,
            }}
          >
            내 일정 학습 데이터 활용 동의 안내문
          </button>
        </div>

        {/* 개인정보 처리방침, 서비스 이용 약관 링크 */}
        <div
          style={{
            marginTop: "40px",
            paddingLeft: "6px",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <button
            type="button"
            onClick={onClickPrivacyPolicy}
            disabled={isLoading}
            style={{
              ...getTextStyle(350, 13, "#525050"),
              cursor: isLoading ? "not-allowed" : "pointer",
            }}
          >
            개인정보 처리방침
          </button>

          <button
            type="button"
            onClick={onClickServiceTerms}
            disabled={isLoading}
            style={{
              ...getTextStyle(350, 13, "#525050"),
              cursor: isLoading ? "not-allowed" : "pointer",
            }}
          >
            서비스 이용 약관
          </button>
        </div>

        {/* 저장 or 에러 메시지 */}
        {(saveMsg || errorMsg) && (
          <div
            style={{
              marginTop: "62px",
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
