import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FindIdXIcon from "../../components/icons/findIdXIcon";
import EmailBoxIcon from "../../components/icons/EmailBoxIcon";
import QuestionIcon from "../../components/icons/QuestionIcon";
import { authCommenStyles as s } from "../../styles/auth/authCommonStyles";
import { getTextStyle } from "../../styles/auth/loginStyles";
import { useMutation } from "@tanstack/react-query";
import {
  postPasswordVerifyCodeCheck,
  postPasswordVerifyCodeSend,
} from "../../api/auth/auth";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function FindPasswordVerifyPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state) || {};

  const [email, setEmail] = useState(state.email ?? "");
  const [code, setCode] = useState("");

  const [sendLocked, setSendLocked] = useState(false);
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
    if (remainSec === 0) setSendLocked(false);
  }, [remainSec]);

  const verifiCodeSendMutation = useMutation({
    mutationFn: () => postPasswordVerifyCodeSend({ email: email.trim() }),
    onSuccess: (result) => {
      if (result.isSuccess) {
        setSendLocked(true);
        setRemainSec(60);
      }
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      const status = error.response?.status;

      if (status === 400) {
        setErrorMsg("이메일 형식을 확인해 주세요.");
      } else {
        setErrorMsg("서버와의 연결에 실패했습니다.");
      }
      console.error("비밀번호 인증코드 발송 에러 상세:", error.response?.data);
    },
  });

  const verifiCodeCheckMutation = useMutation({
    mutationFn: () =>
      postPasswordVerifyCodeCheck({
        email: email.trim(),
        "verify-code": code.trim(),
      }),
    onSuccess: (result) => {
      if (result.isSuccess) {
        navigate("/login/find-password/done", { replace: true, state: { email: email.trim() } });
      }
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      const status = error.response?.status;

      if (status === 400) {
        setErrorMsg("잘못된 인증번호입니다.")
      } else {
        setErrorMsg("서버와의 연결에 실패했습니다.")
      }
      console.error("비밀번호 인증코드 확인 에러 상세:", error.response?.data);
    },
  });

  const isLoading = verifiCodeSendMutation.isPending || verifiCodeCheckMutation.isPending;

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
    width:"80px",
    height: "36px",
    borderRadius: "10px",
    padding: "0 14px",
    background: "#FFFFFF",
    border: canSend ? "1px solid #0066FF" : "1px solid #3182F6",
    color: canSend ? "#0066FF" : "#3182F6",
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

    verifiCodeSendMutation.mutate();
  }

  async function handleNext(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);
    setOkMsg(null);

    if (!canNext) {
      setErrorMsg("이메일과 인증번호(6자리)를 확인해 주세요.");
      return;
    }

    verifiCodeCheckMutation.mutate();
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
        <div style={{ ...getTextStyle(700, 28, "#000000"), ...s.title }}>이메일 주소 입력</div>

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
          <div style={{ marginTop: "18px", marginBottom: "30px" }}>
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
