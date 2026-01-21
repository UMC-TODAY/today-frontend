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
type LoginResponse = {
  success: boolean;
  code?: string;
  message: string;
  data: {
    id: number;
  };
}

const mockLoginApi = (): Promise<LoginResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: "요청이 성공적으로 처리되었습니다.",
        data: { id: 1 }
      });
    }, 500);
  });
};

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [remember, setRemember] = useState(true);
  const [showPw, setShowPw] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const canSubmit = useMemo(() => {
    if (!email.trim() || !password.trim()) return false;
    if (!isValidEmail(email.trim())) return false;
    return true;
  }, [email, password]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);

    if (!canSubmit) {
      setErrorMsg("이메일 형식과 비밀번호를 확인해 주세요.");
      return;
    }

    setIsLoading(true);

    try {

      {/* 
        개발 중일 때만 mockLoginApi() 호출
        나중에 실제 API 연동 시 
         - const result = await mockLoginApi(); 주석 처리
         - const result = await response.json(); 주석 풀기 
         - 아래 주석 처리된 실제 fetch 코드의 주석 풀기
      */}

      // const response = await fetch("/auth/login/email", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     email: email.trim(),
      //     password: password,
      //     remember: remember,
      //   }),
      // });

      // const result = await response.json();
      const result = await mockLoginApi();

      if (result.success) {
        // 로그인 성공
        const payload = { 
          email: email.trim(), 
          userId: result.data.id,
          loggedInAt: Date.now() 
        };
        
        const storage = remember ? window.localStorage : window.sessionStorage;
        storage.setItem(AUTH_KEY, JSON.stringify(payload));

        // 대시보드로 이동
        navigate("/dashboard", { replace: true });
      } else {
        // 로그인 실패
        setErrorMsg(result.message || "로그인에 실패했습니다.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMsg("서버와의 연결에 실패했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleGoogleLogin() {
    alert("구글 로그인은 백엔드 연동 후 사용 가능합니다.");
  }

  function handleNaverLogin() {
    alert("네이버 로그인은 백엔드 연동 후 사용 가능합니다.");
  }

  const submitStyle: React.CSSProperties = {
    ...s.submitBase,
    background: canSubmit && !isLoading ? "#0066FF" : "#3182F6",
    cursor: canSubmit && !isLoading ? "pointer" : "not-allowed",
  };

  return (
    <div style={s.page}>
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
                disabled={isLoading}
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
                disabled={isLoading}
              />

              <button 
                type="button" 
                onClick={() => setShowPw((v) => !v)} 
                style={s.eyeBtn}
                aria-label={showPw ? "비밀번호 숨기기" : "비밀번호 보기"}
                disabled={isLoading}
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
                disabled={isLoading}
              />
              <div style={getTextStyle(400, 11, "#4D4D4D")}>로그인 유지</div>
            </label>

            <Link to="/login/help" style={s.link}>
              로그인이 안되시나요?
            </Link>
          </div>

          {/* 6) 로그인 */}
          <button 
            style={submitStyle} 
            disabled={!canSubmit || isLoading} 
            type="submit"
          >
            <div style={getTextStyle(600, 14, "#FFFFFF")}>
              {isLoading ? "로그인 중..." : "로그인"}
            </div>
          </button>

          {errorMsg && <div style={s.error}>{errorMsg}</div>}

          {/* OR */}
          <div style={s.orRow}>
            <div style={s.line} />
            <div style={{ color: "#4D4D4D" }}>OR</div>
            <div style={s.line} />
          </div>

          {/* 7) 구글 */}
          <button 
            type="button" 
            style={s.socialBtnBase} 
            onClick={handleGoogleLogin}
            disabled={isLoading}
          >
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
            disabled={isLoading}
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