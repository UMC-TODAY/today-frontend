import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FindIdXIcon from "../../components/icons/findIdXIcon";
import EmailBoxIcon from "../../components/icons/EmailBoxIcon";
import QuestionIcon from "../../components/icons/QuestionIcon";
import { findIdStyles as s } from "../../styles/auth/findIdStyles";
import { getTextStyle } from "../../styles/auth/loginStyles";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

type LocationState = {
  email?: string;
};

/**
 * mock: 인증번호 발송
 * 실제 연동 시: POST /auth/email/verification-codes 등으로 교체
 */
const mockSendCodeApi = (
  _email: string,
): Promise<{ success: boolean; message: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, message: "인증번호가 전송되었습니다." });
    }, 500);
  });
};

/**
 * mock: 인증번호 검증
 * 실제 연동 시: POST /auth/email/verification-codes/verify 등으로 교체
 */
const mockVerifyCodeApi = (
  _email,
  code: string,
): Promise<{ success: boolean; message: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (code === "123456") resolve({ success: true, message: "인증 성공" });
      else resolve({ success: false, message: "잘못된 인증번호입니다." });
    }, 500);
  });
};

export default function FindPasswordVerifyPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as LocationState) || {};

  const [email, setEmail] = useState(state.email ?? "");
  const [code, setCode] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [sendLocked, setSnedLocked] = useState(false);
  const [remainSec, setRemainSec] = useState<number>(0);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [okMsg, setOkMsg] = useState<string | null>(null);

  // 60초 타이머
  useEffect(() => {
    if (remainSec <= 0) return;
    const t = window.setInterval(() => {
      setRemainSec((prev) => {
        if (prev <= 1) {
          window.clearInterval(t);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(t);
  }, [remainSec]);

  useEffect(() => {
    if (remainSec === 0) setSnedLocked(false);
  }, [remainSec]);

  const canSend = useMemo(() => {
    if (isLoading) return false;
    if (sendLocked) return false;
    if (!email.trim()) return false;
    if (!isValidEmail(email.trim())) return false;
    return true;
  }, [email, isLoading, sendLocked]);

  const canNext = useMemo(() => {
    if (isLoading) return false;
    if (!email.trim() || !isValidEmail(email.trim())) return false;
    if (code.trim().length !== 6) return false;
    return true;
  }, [email, code, isLoading]);

  const sendBtnStyle: React.CSSProperties = {
    ...s.submitBase,
    width: canSend ? "80px" : "60px",
    height: "36px",
    borderRadius: "10px",
    padding: "0 14px",
    background: canSend ? "#FFFFFF" : "#F2F4F6",
    border: canSend ? "1px solid #3182F6" : "1px solid #E5E8EB",
    color: canSend ? "#3182F6" : "#A0A0A0",
    fontWeight: 600,
    marginTop: 0,
    fontSize: "12px",
  };

  const nextBtnStyle: React.CSSProperties = {
    ...s.submitBase,
    marginTop: "18px",
    background: canNext && !isLoading ? "#0066FF" : "#3182F6",
    cursor: canNext && !isLoading ? "pointer" : "not-allowed",
  };

  async function handleSendCode() {
    setErrorMsg(null);
    setOkMsg(null);

    if (!canSend) {
      setErrorMsg("이메일 형식을 확인해 주세요.");
      return;
    }

    setIsLoading(true);
    try {
      // 실제 연동 시 여기 교체
      // await fetch("/auth/email/verification-codes", { ... })
      const res = await mockSendCodeApi(email.trim());

      if (res.success) {
        setSnedLocked(true);
        setRemainSec(60);
      } else {
        setErrorMsg(res.message || "인증번호 전송에 실패했습닏다.");
      }
    } catch (e) {
      console.error(e);
      setErrorMsg("서버와의 연결 실패");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleNext(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);
    setOkMsg(null);

    if (!canNext) {
      setErrorMsg("이메일과 인증번호(6자리)를 확인해 주세요.");
      return;
    }

    setIsLoading(true);
    try {
      // 실제 연동 시 여기 교체
      // await fetch("/auth/email/verification-codes/verify", { ... })
      const res = await mockVerifyCodeApi(email.trim(), code.trim());

      if (res.success) {
        navigate("/login/find-password/done", {
          replace: true,
        });
      } else {
        setErrorMsg(res.message || "잘못된 인증번호입니다.");
      }
    } catch (e) {
      console.error(e);
      setErrorMsg("서버와의 연결에 실패");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div style={s.page}>
      <div style={s.card}>
        {/* X 나가기 */}
        <button
          type="button"
          style={s.closeBtn}
          aria-label="나가기"
          onClick={() => navigate("/login", { replace: true })}
          disabled={isLoading}
        >
          <FindIdXIcon />
        </button>

        {/* 타이틀/설명 */}
        <div style={getTextStyle(700, 28, "#000000")}>이메일 주소 입력</div>

        <form onSubmit={handleNext}>
          {/* 이메일 */}
          <div style={{ marginTop: "45px", marginBottom: "14px" }}>
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

          {/* 인증 번호 입력하기 */}
          <div style={{ marginTop: "14px" }}>
            <div style={{ ...s.labelRow, marginBottom: "6px" }}>
              <div style={getTextStyle(400, 12, "#4D4D4D")}>
                인증 번호 입력하기
              </div>
            </div>

            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <div style={{ ...s.inputWrap, flex: 1 }}>
                <span style={s.leftIcon}>
                  <EmailBoxIcon />
                </span>

                <input
                  style={{ ...s.input, paddingLeft: 35 }}
                  value={code}
                  onChange={(e) => {
                    const onlyNum = e.target.value
                      .replace(/\D/g, "")
                      .slice(0, 6);
                    setCode(onlyNum);
                  }}
                  placeholder="인증번호 6글자"
                  inputMode="numeric"
                  disabled={isLoading}
                />
              </div>

              <button
                type="button"
                onClick={handleSendCode}
                style={sendBtnStyle}
                disabled={!canSend}
              >
                {sendLocked ? `${remainSec}s` : "전송하기"}
              </button>
            </div>
          </div>

          {/* 다음으로 */}
          <button
            type="submit"
            style={nextBtnStyle}
            disabled={!canNext || isLoading}
          >
            <div style={getTextStyle(500, 14, "#FFFFFF")}>
              {isLoading ? "확인 중..." : "다음으로"}
            </div>
          </button>
        </form>

        {errorMsg && <div style={s.error}>{errorMsg}</div>}
        {okMsg && <div style={s.success}>{okMsg}</div>}
      </div>
    </div>
  );
}
