import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import EyeIcon from "../../components/icons/EyeIcon";
import { AUTH_KEY, getTextStyle, loginStyles as s } from "../../styles/auth/loginStyles";
import QuestionIcon from "../../components/icons/QuestionIcon";
import EmailBoxIcon from "../../components/icons/EmailBoxIcon";
import GoogleLogoIcon from "../../components/icons/GoogleLogoIcon";
import NaverLogoIcon from "../../components/icons/NaverLogoIcon";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [remember, setRemember] = useState(true);
  const [showPw, setShowPw] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const canSubmit = useMemo(() => {
    if (!email.trim() || !password.trim()) return false;
    if (!isValidEmail(email.trim())) return false;
    return true;
  }, [email, password]);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);

    if (!canSubmit) {
      setErrorMsg("이메일 형식과 비밀번호를 확인해 주세요.");
      return;
    }

    // 임시 로그인 처리(백엔드 연동 전)
    const payload = { email: email.trim(), loggedInAt: Date.now() };
    const storage = remember ? window.localStorage : window.sessionStorage;
    storage.setItem(AUTH_KEY, JSON.stringify(payload));

    // 성공 시 대시보드로 이동
    navigate("/dashboard", { replace: true });
  }

  function handleGoogleLogin() {
    alert("구글 로그인은 백엔드 연동 후 사용 가능합니다.");
  }

  function handleNaverLogin() {
    alert("네이버 로그인은 백엔드 연동 후 사용 가능합니다.");
  }

  const submitStyle: React.CSSProperties = {
    ...s.submitBase,
    background: canSubmit ? "#0066FF" : "#3182F6",
    cursor: canSubmit ? "pointer" : "not-allowed",
  };

  return (
    <div style={s.page} >
      <div style={s.card}>
        <div style={getTextStyle(700, 28, "#000000")}>로그인하기</div>
        <div style={s.subtitle}>멤버십 무료 체험 14일 지원중!</div>

        <form onSubmit={handleLogin}>
          {/* 1) 이메일 */}
          <div style={s.fieldBlock}>
            <div style={s.labelRow}>
              <div style={getTextStyle(400, 12, "#4D4D4D")}>
                이메일 <div style={{ marginLeft: "3px" }}><QuestionIcon /></div>
              </div>
            </div>

            <div style={s.inputWrap}>
              <span style={s.leftIcon}>
                <EmailBoxIcon />
              </span>

              <input
                style={{ ...s.input, paddingLeft: 35 }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@naver.com"
                autoComplete="email"
              />
            </div>
          </div>

          {/* 2) 비밀번호 */}
          <div style={s.fieldBlock}>
            <div style={s.labelRow}>
              <div style={getTextStyle(400, 12, "#4D4D4D")}>
                비밀번호 <div style={{ marginLeft: "3px" }}><QuestionIcon /></div>
              </div>
            </div>

            <div style={s.inputWrap}>
              <input
                style={{ ...s.input, ...s.inputPw }}
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호"
                autoComplete="current-password"
              />

              <button 
                type="button" 
                onClick={() => setShowPw((v) => !v)} 
                style={s.eyeBtn}
                aria-label={showPw ? "비밀번호 숨기기" : "비밀번호 보기"}
              >
                <EyeIcon isOn={showPw} />
              </button>
            </div>
          </div>

          {/* 4) 로그인 유지 + 5) 로그인 도움 */}
          <div style={s.row}>
            <label style={s.checkbox}>
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              <div style={getTextStyle(400, 11, "#4D4D4D")}>로그인 유지</div>
            </label>

            <Link to="/login/help" style={s.link}>
              로그인이 안되시나요?
            </Link>
          </div>

          {/* 6) 로그인 */}
          <button style={submitStyle} disabled={!canSubmit} type="submit">
            <div style={getTextStyle(600, 14, "#FFFFFF")}>로그인</div>
          </button>

          {errorMsg && <div style={s.error}>{errorMsg}</div>}

          {/* OR */}
          <div style={s.orRow}>
            <div style={s.line} />
            <div style={{ color: "#4D4D4D" }}>OR</div>
            <div style={s.line} />
          </div>

          {/* 7) 구글 */}
          <button type="button" style={s.socialBtnBase} onClick={handleGoogleLogin}>
            <div style={s.googleIconWrap}>
              <GoogleLogoIcon />
            </div>
            <div style={getTextStyle(600, 14, "#4D4D4D")}>구글로 로그인</div>
          </button>

          {/* 8) 네이버 */}
          <button
            type="button"
            style={{ ...s.socialBtnBase, ...s.naverBtn }}
            onClick={handleNaverLogin}
          >
            <div style={s.naverIconWrap}>
              <NaverLogoIcon />
            </div> 
            <div style={getTextStyle(600, 14, "#FFFFFF")}>네이버로 로그인</div>
          </button>

          {/* 9) 회원가입 */}
          <Link to="/signup" style={s.bottomLink}>
            이메일로 회원가입
          </Link>
        </form>
      </div>
    </div>
  );
}
