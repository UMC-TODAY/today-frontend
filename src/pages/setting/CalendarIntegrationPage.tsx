import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getTextStyle } from "../../styles/auth/loginStyles";
import { authCommenStyles as s } from "../../styles/auth/authCommonStyles";
import GoogleCalendarIcon from "../../components/icons/GoogleCalendarIcon";
import ICloudIcon from "../../components/icons/ICloudIcon";
import CSVIcon from "../../components/icons/CSVIcon";
import NotionIcon from "../../components/icons/NotionIcon";

type Provider = "google" | "icloud" | "csv" | "notion";

type ProviderConfig = {
  key: Provider;
  title: string;
  Icon: React.ComponentType;
  linkLabel: string;
  guidelines: string[];
};

const Providers: ProviderConfig[] = [
  {
    key: "google",
    title: "google 연동",
    Icon: GoogleCalendarIcon,
    linkLabel: "ICS 링크",
    guidelines: ["1. "],
  },
  {
    key: "icloud",
    title: "iCloud 연동",
    Icon: ICloudIcon,
    linkLabel: "ICS 링크",
    guidelines: [
      "1. 브라우저에서 https://www.icloud.com 접속",
      "2. Apple ID로 로그인",
      "3. 캘린더(Calendar) 선택",
      "4. 왼쪽 캘린더 목록에서 연동할 캘린더 오른쪽 공유 아이콘(👤) 클릭",
      "5. [공개 캘린더] 옵션을 ON",
      "6. 공개 캘린더를 커먼 공유 링크(URL) 생성됨",
      "7. [링크 복사] 클릭하여 복사",
    ],
  },
  {
    key: "csv",
    title: "CSV 파일 연동",
    Icon: CSVIcon,
    linkLabel: "ICS 링크",
    guidelines: ["1. "],
  },
  {
    key: "notion",
    title: "Notion 연동",
    Icon: NotionIcon,
    linkLabel: "ICS 링크",
    guidelines: ["1. "],
  },
];

export default function CalendarConnectPage() {
  const navigate = useNavigate();
  const params = useParams();

  const integrateTo = (params.provider || "") as Provider;

  const description = useMemo(() => {
    return Providers.find((d) => d.key === integrateTo) ?? null;
  }, [integrateTo]);

  const [link, setLink] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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

  async function handleIntegrate() {
    if (!description) return;
    if (!canSubmit) return;

    setErrorMsg(null);
    setIsLoading(true);

    try {
      alert("백엔드 연동 예정");
    } catch (e) {
      console.error(e);
      setErrorMsg("연동에 실패했습니다. 다시 시도해 주세요.");
    } finally {
      setIsLoading(false);
    }
  }

  if (!description) return;
  const Icon = description.Icon;

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
          <Icon />
          <div
            style={{ ...getTextStyle(650, 20, "#000000"), marginTop: "5px" }}
          >
            {description.title}
          </div>
        </div>

        {/* 입력 영역 */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "10px",
            alignItems: "center",
            marginTop: "120px",
          }}
        >
          <div style={getTextStyle(500, 14, "#000000")}>
            {description.linkLabel}
          </div>
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
          {description.guidelines.map((line) => line).join("\n")}
        </div>

        {/* 에러 메시지 */}
        {errorMsg && (
          <div
            style={{
              marginTop: "12px",
              color: "#D93025",
              fontSize: "13px",
              fontWeight: 600,
              textAlign: "center",
            }}
          >
            {errorMsg}
          </div>
        )}

        {/* 버튼 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: "60px",
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
