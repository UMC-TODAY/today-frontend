import { useNavigate } from "react-router-dom";
import { getTextStyle } from "../../styles/auth/loginStyles";
import GoogleCalendarIcon from "../icons/GoogleCalendarIcon";
import ICloudIcon from "../icons/ICloudIcon";
import CSVIcon from "../icons/CSVIcon";
import NotionIcon from "../icons/NotionIcon";
import LickIcon from "../icons/LinkIcon";
import { useMutation } from "@tanstack/react-query";
import { postGoogleIntegration, postNotionIntegration } from "../../api/setting/calendar";

export default function CalendarIntegrationPanel({
  goWithdraw
}: {
  goWithdraw: () => void;
}) {
  const navigate = useNavigate();

  const token = localStorage.getItem("accessToken") || "";

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
    }
  })

  function onClickNotion() {
    notionMutation.mutate();
  }

  function onClickGoogle() {
    googleMutation.mutate();
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
            <button
              type="button"
              onClick={onClickGoogle}
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
            <button
              type="button"
              onClick={() => navigate("/setting/calendar/csv")}
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
