import { useNavigate } from "react-router-dom";
import { getTextStyle } from "../../styles/auth/loginStyles";
import GoogleCalendarIcon from "../icons/GoogleCalendarIcon";
import ICloudIcon from "../icons/ICloudIcon";
import CSVIcon from "../icons/CSVIcon";
import NotionIcon from "../icons/NotionIcon";
import LickIcon from "../icons/LinkIcon";

type IntegrationCategory = "GOOGLE" | "ICLOUD" | "CSV" | "NOTION";

type IntegrationItem = {
  key: IntegrationCategory;
  title: string;
  Icon: React.ComponentType;
  to: string;
};

const Integrations: IntegrationItem[] = [
  {
    key: "GOOGLE",
    title: "구글 캘린더",
    Icon: GoogleCalendarIcon,
    to: "/setting/calendar/google",
  },
  {
    key: "ICLOUD",
    title: "iCloud 캘린더",
    Icon: ICloudIcon,
    to: "/setting/calendar/icloud",
  },
  { key: "CSV", 
    title: "CSV 파일", 
    Icon: CSVIcon, 
    to: "/setting/calendar/csv" 
  },
  {
    key: "NOTION",
    title: "Notion",
    Icon: NotionIcon,
    to: "/setting/calendar/notion",
  },
];

export default function CalendarIntegrationPanel() {
  const navigate = useNavigate();

  function onClickWithdraw() {
    navigate("/setting/withdraw");
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
            {Integrations.map(({ key, title, Icon, to }) => (
              <button
                key={key}
                type="button"
                onClick={() => navigate(to)}
                style={{
                  height: "52px",
                  borderRadius: "6px",
                  border: "1px solid #E6E7E9",
                  background: "#FFFFFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0 18px",
                  cursor: "pointer",
                }}
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
                    <Icon />
                  </div>
                  <div style={{ ...getTextStyle(450, 14, "#525050"), marginTop: "2px" }}>{title}</div>
                </div>
                <LickIcon />
              </button>
            ))}
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

        <button
          type="button"
          disabled
          style={{
            height: "38px",
            width: "100px",
            borderRadius: "12px",
            background: "#5C92FF",
            color: "#FFFFFF",
            fontWeight: 600,
            fontSize: "14px",
            cursor: "pointer",
          }}
        >
          저장
        </button>
      </div>
    </div>
  );
}
