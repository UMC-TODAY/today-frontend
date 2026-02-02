import { useLocation, useNavigate } from "react-router-dom";
import { authCommenStyles as s } from "../../styles/auth/authCommonStyles";
import { getTextStyle } from "../../styles/auth/loginStyles";

export default function FindPasswordDonePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state) || {};
  const email = state.email || "";

  const primaryBtnStyle: React.CSSProperties = {
    ...s.submitBase,
    background: "#3182F6",
    cursor: "pointer",
    marginTop: "20px",
  };

  const secondaryBtnStyle: React.CSSProperties = {
    ...s.submitBase,
    background: "#FFFFFF",
    color: "#3182F6",
    border: "1px solid #3182F6",
    cursor: "pointer",
    marginTop: "10px",
  };

  return (
    <div style={s.page}>
      <div
        style={{
          width: "380px",
          height: "480px",
          borderRadius: "12px",
          padding: "80px 45px 26px",
          position: "relative",
        }}
      >
        {/* 타이틀 */}
        <div style={{ textAlign: "center" }}>
          <div style={getTextStyle(700, 28, "#000000")}>
            비밀번호를 재설정합니다.
          </div>

          <div
            style={{
              marginTop: "20px",
              color: "#4D4D4D",
              fontSize: "12px",
              lineHeight: 1.5,
            }}
          >
            비밀번호가 기억나지 않으실 경우
            <br />
            새로운 비밀번호를 설정하고 로그인 하실 수 있습니다.
          </div>
        </div>

        {/* 버튼들 */}
        <div style={{ marginTop: "25px"}}>
          <button
            type="button"
            style={primaryBtnStyle}
            onClick={() => navigate("/login/reset-password", { state: { email: email.trim() }} )}
          >
            <div style={getTextStyle(600, 14, "#FFFFFF")}>비밀번호 재설정</div>
          </button>

          <button
            type="button"
            style={secondaryBtnStyle}
            onClick={() => navigate("/login")}
          >
            <div style={getTextStyle(600, 14, "#0066FF")}>돌아가기</div>
          </button>
        </div>
      </div>
    </div>
  );
}
