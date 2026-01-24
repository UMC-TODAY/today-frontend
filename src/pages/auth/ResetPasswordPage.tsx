import { useNavigate } from "react-router-dom";
import FindIdXIcon from "../../components/icons/findIdXIcon";
import QuestionIcon from "../../components/icons/QuestionIcon";
import { findIdStyles as s } from "../../styles/auth/findIdStyles";
import { getTextStyle } from "../../styles/auth/loginStyles";
import { useMemo, useState } from "react";

function isValidPassword(pw: string) {
  if (pw.length < 8 || pw.length > 32) return false;
  const hasLetter = /[A-Za-z]/.test(pw);
  const hasNumber = /[0-9]/.test(pw);
  const hasSpecial = /[^A-Za-z0-9]/.test(pw);
  return hasLetter && hasNumber && hasSpecial;
}

export default function ResetPasswordPage() {
  const navigate = useNavigate();

  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [isPwInvalid, setIsPwInvalid] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const pwOk = useMemo(() => isValidPassword(pw.trim()), [pw]);
  const sameOk = useMemo(
    () => pw.trim() !== "" && pw.trim() === pw2.trim(),
    [pw, pw2],
  );

  const submitStyle: React.CSSProperties = {
    ...s.submitBase,
    background: "#3182F6",
    cursor: "pointer",
    marginTop: "18px",
  };

  function handleClose() {
    navigate("/login", { replace: true });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);

    if (!pwOk) {
      setIsPwInvalid(true);
      return;
    }
    setIsPwInvalid(false);

    if (!sameOk) {
      setErrorMsg("위 작성된 비밀번호와 일치하지 않습니다.");
      return;
    }

    // 백엔드 연동하면 비밀번호 초기화 후 해당 입력된 비밀번호로 변경
    // (나중에 실제 API 붙이면 여기서 fetch로 비밀번호 변경 요청)
    // 그 후 1. 로그인(/login)으로 이동
    navigate("/login");
  }

  const infoTextStyle: React.CSSProperties = {
    color: isPwInvalid ? "#d93025" : "#6F6F6F",
    textAlign: "left",
    flex: 1,
    fontSize: "11px",
    lineHeight: 1.45,
  };

  return (
    <div style={s.page}>
      <div style={{ ...s.card, paddingTop: "80px" }}>
        {/* X 나가기 버튼 */}
        <button
          type="button"
          style={s.closeBtn}
          aria-label="나가기"
          onClick={handleClose}
        >
          <FindIdXIcon />
        </button>

        {/* 타이틀 */}
        <div style={getTextStyle(700, 24, "#000000")}>
          새 비밀번호를 입력하세요
        </div>

        <form onSubmit={handleSubmit}>
          {/* 비밀번호 */}
          <div style={{ ...s.fieldBlock, marginTop: "35px" }}>
            <div style={{ ...s.labelRow, marginLeft: "8px" }}>
              <div style={getTextStyle(400, 12, "#4D4D4D")}>비밀번호 </div>
            </div>

            <div style={s.inputWrap}>
              <input
                style={{ ...s.input }}
                type="password"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                placeholder=""
                autoComplete="new-password"
                maxLength={32}
              />
            </div>

            {/* 안내문 */}
            <div
              style={{
                marginTop: "10px",
                display: "flex",
              }}
            >
              <div
                style={{
                  marginLeft: "5px",
                  marginRight: "6px",
                  marginTop: "1px",
                  flexShrink: 0,
                }}
              >
                <QuestionIcon />
              </div>
              <div style={infoTextStyle}>
                8자리 이상의 영문, 숫자, 특수문자 조합을 입력하세요.
                <br />
                (3자 이상의 연속된 동일 문자, 숫자로는 설정 불가합니다.)
              </div>
            </div>
          </div>

          {/* 비밀번호 확인 */}
          <div style={{ ...s.fieldBlock, marginTop: "22px" }}>
            <div style={{ ...s.labelRow, marginLeft: "8px" }}>
              <div style={getTextStyle(400, 12, "#4D4D4D")}>비밀번호 확인</div>
            </div>

            <div style={s.inputWrap}>
              <input
                style={{ ...s.input }}
                type="password"
                value={pw2}
                onChange={(e) => setPw2(e.target.value)}
                placeholder=""
                autoComplete="new-password"
                maxLength={32}
              />
            </div>

            {/* 안내문 */}
            <div
              style={{
                marginTop: "10px",
                fontSize: "11px",
                color: "#6F6F6F",
                lineHeight: 1.45,
                display: "flex",
              }}
            >
              <div
                style={{
                  marginLeft: "5px",
                  marginRight: "6px",
                  marginTop: "1px",
                  flexShrink: 0,
                }}
              >
                <QuestionIcon />
              </div>
              확인을 위해 입력하신 비밀번호를 다시 입력해 주세요.
            </div>
          </div>

          {/* 확인 버튼 */}
          <button type="submit" style={submitStyle}>
            <div style={getTextStyle(600, 14, "#FFFFFF")}>확인</div>
          </button>
        </form>

        {errorMsg && (
          <div style={{ ...s.error, marginTop: "16px" }}>{errorMsg}</div>
        )}
      </div>
    </div>
  );
}
