import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import EyeIcon from "../../components/icons/EyeIcon";
import {
  AUTH_KEY,
  getTextStyle,
  loginStyles as s,
} from "../../styles/auth/loginStyles";
import QuestionIcon from "../../components/icons/QuestionIcon";
import EmailBoxIcon from "../../components/icons/EmailBoxIcon";
import GoogleLogoIcon from "../../components/icons/GoogleLogoIcon";
import NaverLogoIcon from "../../components/icons/NaverLogoIcon";
import { useMutation } from "@tanstack/react-query";
import { postEmailLogin } from "../../api/auth/auth";

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
  
  const OAUTH_BASE = import.meta.env.VITE_API_BASE_URL;

  const canSubmit = useMemo(() => {
    if (!email.trim() || !password.trim()) return false;
    if (!isValidEmail(email.trim())) return false;
    return true;
  }, [email, password]);

  const loginMutation = useMutation({
    mutationFn: () =>
      postEmailLogin({
        email: email.trim(),
        password: password,
      }),
    onSuccess: (result) => {
      if (!result.isSuccess) {
        setErrorMsg("잘못된 이메일 혹은 비밀번호를 입력하셨습니다.");
        return;
      }

      if (result.isSuccess && "data" in result) {
        const storage = remember ? window.localStorage : window.sessionStorage;
        storage.setItem("accessToken", result.data.accessToken);

        const payload = {
          email: email.trim(),
          loggedInAt: Date.now(),
        };

        storage.setItem(AUTH_KEY, JSON.stringify(payload));

        navigate("/dashboard", { replace: true });
      }
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      const status = error.response?.status;

      if (status === 405 || status === 404 || status === 400) {
        setErrorMsg("잘못된 이메일 혹은 비밀번호를 입력하셨습니다.");
      } else {
        setErrorMsg("서버와의 연결에 실패했습니다.");
      }

      console.error("로그인 에러 상세:", error.response?.data);
    },
  });

  const isLoading = loginMutation.isPending;

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);

    if (!canSubmit) {
      setErrorMsg("이메일 형식과 비밀번호를 확인해 주세요.");
      return;
    }

    loginMutation.mutate();
  }

  function handleGoogleLogin() {
    window.location.href = `${OAUTH_BASE}/oauth2/authorization/google`;
  }

  function handleNaverLogin() {
    window.location.href = `${OAUTH_BASE}/oauth2/authorization/naver`;
  }

  const submitStyle: React.CSSProperties = {
    ...s.submitBase,
    background: canSubmit && !isLoading ? "#0066FF" : "#3182F6",
    cursor: canSubmit && !isLoading ? "pointer" : "not-allowed",
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={{ ...getTextStyle(700, 28, "#000000"), ...s.title }}>로그인하기</div>
        <div style={s.subtitle}>멤버십 무료 체험 14일 지원중!</div>

        <form onSubmit={handleLogin}>
          {/* 1) 이메일 */}
          <div style={s.fieldBlock}>
            <div style={s.labelRow}>
              <div style={getTextStyle(400, 12, "#4D4D4D")}>
                이메일{" "}
                <div style={{ marginLeft: "3px" }}>
                  <QuestionIcon />
                </div>
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
                비밀번호{" "}
                <div style={{ marginLeft: "3px" }}>
                  <QuestionIcon />
                </div>
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
