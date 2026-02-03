import { useMemo, useState } from "react";
import { settingsModalStyles as s } from "../../styles/setting/settingModalStyles";
import FindIdXIcon from "../icons/findIdXIcon";
import CalendarIntegrationPanel from "./CalendarIntegrationPanel";
import NotificationSettingPanel from "./NotificationSettingPanel";
import PrivacyAnalyticsPanel from "./PrivacyAnalyticsPanel";
import ProfileSettingPanel from "./ProfileSettingPanel";

type TabKey = "profile" | "notificaton" | "calendar" | "privacy";

const TAB_LABEL: Record<TabKey, string> = {
  profile: "프로필 설정",
  notificaton: "알림 설정",
  calendar: "캘린더 연동 관리",
  privacy: "개인정보 및 분석 설정",
};

export default function SettingModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [choice, setChoice] = useState<TabKey>("profile");

  const right = useMemo(() => {
    switch (choice) {
      case "profile":
        return <ProfileSettingPanel />;
      case "notificaton":
        return <NotificationSettingPanel />;
      case "calendar":
        return <CalendarIntegrationPanel />;
      case "privacy":
        return <PrivacyAnalyticsPanel />;
      default:
        return null;
    }
  }, [choice]);

  if (!isOpen) return null;

  return (
    <div style={s.overlay} role="dialog" aria-modal="true">
      <div style={s.modal}>
        {/* 닫기 버튼 */}
        <button
          type="button"
          style={s.closeBtn}
          aria-label="닫기"
          onClick={onClose}
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