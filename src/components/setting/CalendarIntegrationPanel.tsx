import { useNavigate } from "react-router-dom";
import { getTextStyle } from "../../styles/auth/loginStyles";
import GoogleCalendarIcon from "../icons/GoogleCalendarIcon";
import ICloudIcon from "../icons/ICloudIcon";
import CSVIcon from "../icons/CSVIcon";
import NotionIcon from "../icons/NotionIcon";
import LickIcon from "../icons/LinkIcon";
import { useMutation } from "@tanstack/react-query";
import {
  postCsvUpload,
  postGoogleIntegration,
  postNotionIntegration,
} from "../../api/setting/calendar";
import { useRef, useState } from "react";
import { getAccessToken } from "../../utils/tokenStorage";

export default function CalendarIntegrationPanel({
  goWithdraw,
}: {
  goWithdraw: () => void;
}) {
  const navigate = useNavigate();

  const token = getAccessToken() || "";

  const fileRef = useRef<HTMLInputElement | null>(null);
  const [CSVMsg, setCSVMsg] = useState<string | null>(null);

  const btnStyle: React.CSSProperties = {
    height: "52px",
    borderRadius: "6px",
    border: "1px solid #E6E7E9",
    background: "#FFFFFF",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 18px",
    cursor: "pointer",
  };

  const notionMutation = useMutation({
    mutationFn: () => postNotionIntegration(token),
    onSuccess: (result) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      window.location.href = (result as any).data.authorizeUrl;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      console.error("notion 연동 인가 URL 발급 에러:", error?.response?.data);
    },
  });

  const googleMutation = useMutation({
    mutationFn: () => postGoogleIntegration(token),
    onSuccess: (result) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      window.location.href = (result as any).data.authorizeUrl;
    },
  });

  const CSVMutation = useMutation({
    mutationFn: (file: File) => postCsvUpload(token, file),
    onSuccess: (result) => {
      if (result.isSuccess) {
        setCSVMsg("CSV 일정 업로드가 완료되었습니다.");
      }
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      setCSVMsg("CSV 업로드에 실패했습니다.");
      console.error("CSV 업로드 에러 상세:", error?.response?.data);
    },
  });

  function onClickNotion() {
    notionMutation.mutate();
  }

  function onClickGoogle() {
    googleMutation.mutate();
  }

  function onClickCSV() {
    setCSVMsg(null);

    fileRef.current?.click();
  }

  function onChangeCSVFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setCSVMsg(null);
    CSVMutation.mutate(file);

    // 같은 파일을 다시 선택할 수 있도록 함
    e.target.value = "";
  }

  function onClickWithdraw() {
    goWithdraw();
  }

  return (
    <div>
      <div
        style={{
          ...getTextStyle(500, 16, "#6987D2"),
          marginTop: "20px",
          marginBottom: "40px",
        }}
      >
        캘린더 연동 관리
      </div>

      <input
        type="file"
        ref={fileRef}
        accept=".csv"
        style={{ display: "none" }}
        onChange={onChangeCSVFile}
      />

      {/* 연동 버튼들 */}
      <div
        style={{ position: "relative", height: "480px", overflow: "hidden" }}
      >
        <div style={{ paddingLeft: "6px", paddingRight: "30px" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              width: "280px",
            }}
          >
            {/* 구글 */}
            <button type="button" onClick={onClickGoogle} style={btnStyle}>
              <div
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <div
                  style={{
                    width: "22px",
                    height: "22px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <GoogleCalendarIcon />
                </div>
                <div
                  style={{
                    ...getTextStyle(450, 14, "#525050"),
                    marginTop: "2px",
                  }}
                >
                  구글 캘린더
                </div>
              </div>
              <LickIcon />
            </button>

            {/* iCloud */}
            <button
              type="button"
              onClick={() => navigate("/setting/calendar/iCloud")}
              style={btnStyle}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <div
                  style={{
                    width: "22px",
                    height: "22px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <ICloudIcon />
                </div>
                <div
                  style={{
                    ...getTextStyle(450, 14, "#525050"),
                    marginTop: "2px",
                  }}
                >
                  iCloud 캘린더
                </div>
              </div>
              <LickIcon />
            </button>

            {/* CSV */}
            <button type="button" onClick={onClickCSV} style={btnStyle}>
              <div
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <div
                  style={{
                    width: "22px",
                    height: "22px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <CSVIcon />
                </div>
                <div
                  style={{
                    ...getTextStyle(450, 14, "#525050"),
                    marginTop: "2px",
                  }}
                >
                  CSV 파일
                </div>
              </div>
              <LickIcon />
            </button>

            {/* Notion */}
            <button type="button" onClick={onClickNotion} style={btnStyle}>
              <div
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <div
                  style={{
                    width: "22px",
                    height: "22px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <NotionIcon />
                </div>
                <div
                  style={{
                    ...getTextStyle(450, 14, "#525050"),
                    marginTop: "2px",
                  }}
                >
                  Notion
                </div>
              </div>
              <LickIcon />
            </button>
          </div>

          {/* CSV 업로드 메시지 */}
          {CSVMsg && (
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "70px",
                fontSize: "13px",
                fontWeight: 600,
                color: CSVMsg.includes("완료") ? "#0066FF" : "#D93025",
              }}
            >
              {CSVMsg}
            </div>
          )}
        </div>
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
          style={{
            height: "38px",
            width: "100px",
            borderRadius: "12px",
            border: "1px solid #E54D52",
            background: "#FFFFFF",
            color: "#E54D52",
            fontWeight: 600,
            fontSize: "14px",
            cursor: "pointer",
          }}
        >
          회원탈퇴
        </button>
      </div>
    </div>
  );
}
