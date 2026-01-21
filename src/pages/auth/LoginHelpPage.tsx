import { useNavigate } from "react-router-dom";
import { getTextStyle } from "../../styles/auth/loginStyles";
import { loginHelpStyles as s } from "../../styles/auth/loginHelpStyles";
import LoginHelpPersonIcon from "../../components/icons/LoginHelpPersonIcon";
import LoginHelpLockIcon from "../../components/icons/LoginHelpLockIcon";

type HelpCardProps = {
  icon: React.ReactNode;
  title: string;
  desc: string;
  onClick: () => void;
};

function HelpCard({ icon, title, desc, onClick }: HelpCardProps) {
  return (
    <button type="button" style={s.cardButton} onClick={onClick}>
      <div style={s.iconWrap}>{icon}</div>

      <div style={s.cardTitle}>{title}</div>
      <div style={s.cardDesc}>{desc}</div>
    </button>
  );
}

export default function LoginHelpPage() {
  const navigate = useNavigate();

  return (
    <div style={s.page}>
      <div style={s.container}>
        <div style={s.header}>
          <div style={getTextStyle(700, 28, "#000000")}>로그인이 안되시나요?</div>
          <div style={s.subHeaderText}>
            몇 가지 이유로 로그인하지 못할 수 있습니다.
            <br />
            아래에서 해결 방법을 확인해 보세요.
          </div>
        </div>

        <div style={s.cardsRow}>
          <HelpCard
            icon={<LoginHelpPersonIcon />}
            title="아이디를 잊어버리셨나요?"
            desc={"잘 기억나지 않을 경우 여기에서\n정보를 요청하여 이메일로 받아볼 수 있어요."}
            onClick={() => navigate("/login/find-id")}
          />

          <HelpCard
            icon={<LoginHelpLockIcon />}
            title="비밀번호를 잊어버리셨나요?"
            desc={"비밀번호를 잊어버린 경우 여기에서\n초기화할 수 있습니다."}
            onClick={() => navigate("/login/find-password")}
          />
        </div>
      </div>
    </div>
  );
}