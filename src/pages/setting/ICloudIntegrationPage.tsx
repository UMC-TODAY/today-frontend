import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTextStyle } from "../../styles/auth/loginStyles";
import { authCommenStyles as s } from "../../styles/auth/authCommonStyles";
import ICloudIcon from "../../components/icons/ICloudIcon";
import { useMutation } from "@tanstack/react-query";
import {
  getIntegrationStatus,
  postICloudIntegration,
} from "../../api/setting/calendar";
import { getAccessToken } from "../../utils/tokenStorage";

export default function CalendarConnectPage() {
  const navigate = useNavigate();

  const token = getAccessToken() || "";

  const [link, setLink] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const guidelines = [
    "1. 브라우저에서 https://www.icloud.com 접속",
    "2. Apple ID로 로그인",
    "3. 캘린더(Calendar) 선택",
    "4. 왼쪽 캘린더 목록에서 연동할 캘린더 오른쪽 공유 아이콘(👤) 클릭",
    "5. [공개 캘린더] 옵션을 ON",
    "6. 공개 캘린더를 커먼 공유 링크(URL) 생성됨",
    "7. [링크 복사] 클릭하여 복사",
  ];

  const iCloudMutation = useMutation({
    mutationFn: () => postICloudIntegration(token, { icsUrl: link.trim() }),
    onSuccess: (result) => {
      if (result.isSuccess) {
        integrationStatusMutation.mutate();
      }
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      setSuccessMsg(null);

      if (!error.response.data.isSuccess) {
        setErrorMsg("ICS 링크를 다시 확인해주세요.");
        return;
      }

      setErrorMsg("서버와의 연결에 실패했습니다.");
      console.error("iCloud 연동 에러 상세:", error?.response.data);
    },
  });

  const integrationStatusMutation = useMutation({
    mutationFn: getIntegrationStatus,
    onSuccess: (result) => {
      if (result.isSuccess) {
        const iCloudStatus = result.data?.providers.find(
          (p) => p.provider === "ICLOUD",
        );

        if (iCloudStatus?.connected) {
          setSuccessMsg("iCloud 캘린더가 연동되었습니다.");
        } else {
          setErrorMsg("iCloud 캘린더 연동에 실패했습니다.");
        }
      }
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      setErrorMsg("iCloud 연동에 실패했습니다.");
      console.error("iCloud 연동 에러 상세:", error?.response.data);
    },
  });

  const isLoading = iCloudMutation.isPending;

  const canSubmit = useMemo(
    () => link.trim().length > 0 && !isLoading,
    [link, isLoading],
  );

  const submitStyle: React.CSSProperties = {
    width: "280px",
    height: "32px",
    borderRadius: "10px",
    marginTop: "14px",
    background: canSubmit ? "#3182F6" : "#5C92FF",
    cursor: canSubmit ? "pointer" : "not-allowed",
  };

  const backBtnStyle: React.CSSProperties = {
    width: "280px",
    height: "32px",
    borderRadius: "10px",
    background: "#FFFFFF",
    border: "1px solid #3182F6",
    cursor: "pointer",
    marginTop: "12px",
  };

  function handleBack() {
    navigate(-1);
  }

  function handleIntegrate() {
    if (!canSubmit) return;

    setErrorMsg(null);
    setSuccessMsg(null);

    iCloudMutation.mutate();
  }

  return (
    <div style={s.page}>
      <div
        style={{
          width: "500px",
          height: "600px",
          background: "#FFFFFF",
          borderRadius: "12px",
          padding: "25px 40px 26px",
          position: "relative",
        }}
      >
        {/* 타이틀 + 아이콘 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginTop: "8px",
          }}
        >
          <ICloudIcon />
          <div
            style={{ ...getTextStyle(650, 20, "#000000"), marginTop: "5px" }}
          >
            iCloud 연동
          </div>
        </div>

        {/* ICS 링크 입력 */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "10px",
            alignItems: "center",
            marginTop: "120px",
          }}
        >
          <div style={getTextStyle(500, 14, "#000000")}>ICS 링크</div>
          <input
            value={link}
            onChange={(e) => {
              setLink(e.target.value);
              setErrorMsg(null);
            }}
            disabled={isLoading}
            style={{
              width: "240px",
              height: "30px",
              borderRadius: "10px",
              border: "1px solid #E5E8EB",
              paddingLeft: "8px",
              outline: "none",
              fontSize: "12px",
            }}
          />
        </div>

        {/* 안내문 */}
        <div
          style={{
            marginTop: "36px",
            marginLeft: "60px",
            color: "#AEAEAE",
            fontSize: "12px",
            lineHeight: 1.7,
            whiteSpace: "pre-line",
          }}
        >
          {guidelines.join("\n")}
        </div>

        {/* 저장 or 에러 메시지 */}
        <div
          style={{
            marginTop: "50px",
            textAlign: "center",
            fontSize: "13px",
            fontWeight: 600,
            color: successMsg ? "#0066FF" : "#D93025",
            whiteSpace: "pre-line",
            minHeight: "22px",
          }}
        >
          {successMsg || errorMsg || ""}
        </div>

        {/* 버튼 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <button
            type="button"
            style={submitStyle}
            disabled={!canSubmit}
            onClick={handleIntegrate}
          >
            <div style={getTextStyle(550, 14, "#FFFFFF")}>
              {isLoading ? "연동 중..." : "연동하기"}
            </div>
          </button>

          <button
            type="button"
            style={backBtnStyle}
            onClick={handleBack}
            disabled={isLoading}
          >
            <div style={getTextStyle(550, 14, "#3182F6")}>돌아가기</div>
          </button>
        </div>
      </div>
    </div>
  );
}
