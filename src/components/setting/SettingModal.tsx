import { useEffect, useMemo, useState } from "react";
import { settingsModalStyles as s } from "../../styles/setting/settingModalStyles";
import FindIdXIcon from "../icons/findIdXIcon";
import CalendarIntegrationPanel from "./CalendarIntegrationPanel";
import NotificationSettingPanel from "./NotificationSettingPanel";
import PrivacyAnalyticsPanel from "./PrivacyAnalyticsPanel";
import ProfileSettingPanel from "./ProfileSettingPanel";
import { useNavigate } from "react-router-dom";

type TabKey = "profile" | "notification" | "calendar" | "privacy";

const TAB_LABEL: Record<TabKey, string> = {
  profile: "프로필 설정",
  notification: "알림 설정",
  calendar: "캘린더 연동 관리",
  privacy: "개인정보 및 분석 설정",
};

export default function SettingModal({
  isOpen,
  onClose,
  panel,
}: {
  isOpen: boolean;
  onClose: () => void;
  panel?: string | null;
}) {
  const navigate = useNavigate();
  const [choice, setChoice] = useState<TabKey>("profile");

  const handleClose = () => {
    onClose();
    setChoice("profile");
  };

  useEffect(() => {
    if (!isOpen) return;

    if (panel === "profile") setChoice("profile");
    else if (panel === "notification") setChoice("notification");
    else if (panel === "calendar") setChoice("calendar");
    else if (panel === "privacy") setChoice("privacy");
  }, [isOpen, panel]);

  const goWithdraw = () => {
    onClose();
    navigate(`/setting/withdraw?from=${choice}`);
  };

  const right = useMemo(() => {
    switch (choice) {
      case "profile":
        return <ProfileSettingPanel goWithdraw={goWithdraw} />;
      case "notification":
        return <NotificationSettingPanel goWithdraw={goWithdraw} />;
      case "calendar":
        return <CalendarIntegrationPanel goWithdraw={goWithdraw} />;
      case "privacy":
        return <PrivacyAnalyticsPanel goWithdraw={goWithdraw} />;
      default:
        return null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [choice]);

  if (!isOpen) return null;

  return (
    <div
      style={s.overlay}
      role="dialog"
      aria-modal="true"
      onClick={handleClose}
    >
      <div style={s.modal} onClick={(e) => e.stopPropagation()}>
        {/* 닫기 버튼 */}
        <button
          type="button"
          style={s.closeBtn}
          aria-label="닫기"
          onClick={handleClose}
        >
          <FindIdXIcon />
        </button>

        {/* Left */}
        <div style={s.left}>
          <div style={s.leftTitle}>설정</div>

          {(Object.keys(TAB_LABEL) as TabKey[]).map((key) => (
            <button
              key={key}
              type="button"
              style={s.menuItem(choice === key)}
              onClick={() => setChoice(key)}
            >
              {TAB_LABEL[key]}
            </button>
          ))}
        </div>

        {/* right */}
        <div style={s.right}>{right}</div>
      </div>
    </div>
  );
}