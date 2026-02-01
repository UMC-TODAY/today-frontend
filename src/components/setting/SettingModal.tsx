import CalendarIntegrationPanel from "./CalendarIntegrationPanel";
import NotificationSettingPanel from "./NotificationSettingPanel";
import PrivacyAnalyticsPanel from "./PrivacyAnalyticsPanel";
import ProfileSettingPanel from "./ProfileSettingPanel";

export default function SettingModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div>
      <div>SettingModal</div>
      <button onClick={onClose}>X</button>
      <div>Left: Tabs</div>
      <div>
        <div>Right: Panels</div>
        <ProfileSettingPanel />
        <NotificationSettingPanel />
        <CalendarIntegrationPanel />
        <PrivacyAnalyticsPanel />
      </div>
    </div>
  );
}
