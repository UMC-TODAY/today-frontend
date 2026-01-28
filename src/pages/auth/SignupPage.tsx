import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signupStyles as s } from "../../styles/auth/signupStyles";
import { getTextStyle } from "../../styles/auth/loginStyles";
import QuestionIcon from "../../components/icons/QuestionIcon";
import EmailBoxIcon from "../../components/icons/EmailBoxIcon";
import FindIdXIcon from "../../components/icons/findIdXIcon";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function onlyDigits(v: string) {
  return v.replace(/\D/g, "");
}

// mock: 백엔드 연동 전
const EXISTING_EMAILS = ["kei@naver.com", "test@gmail.com"];

const mockSendEmailCode = async (email: string) => {
  await new Promise((r) => setTimeout(r, 500));

  if (EXISTING_EMAILS.includes(email)) {
    return {
      success: false,
      message: "이미 가입된 이메일입니다.",
    };
  }

  return { success: true, message: "요청이 성공적으로 처리되었습니다." };
};

const mockVerifyEmailCode = async (_email: string, code: string) => {
  await new Promise((r) => setTimeout(r, 500));
  const ok = code === "123456";
  return ok
    ? { success: true as const, message: "인증이 완료되었습니다." }
    : { success: false as const, message: "인증번호가 올바르지 않습니다." };
};

export default function SignupPage() {
  const navigate = useNavigate();

  // inputs
  const [birth, setBirth] = useState(""); // 6자리
  const [rr1, setRr1] = useState(""); // 1자리
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");

  const [remainSec, setRemainSec] = useState<number>(0);
  const [sendLocked, setSendLocked] = useState(false);

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

  // states
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [sent, setSent] = useState(false);
  const [verified, setVerified] = useState(false);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [okMsg, setOkMsg] = useState<string | null>(null);

  const birthOk = useMemo(() => birth.length === 6, [birth]);
  const rr1Ok = useMemo(() => rr1.length === 1, [rr1]);
  const emailOk = useMemo(() => isValidEmail(email.trim()), [email]);

  const canSend = emailOk && !isSending;
  const canVerify = sent && code.length === 6 && !isVerifying;
  const canNext = birthOk && rr1Ok && verified;

  const sendBtnStyle: React.CSSProperties = {
    ...s.rightBtn,
    border: canSend ? "1px solid #0066FF" : "1px solid #3182F6",
    color: canSend ? "#0066FF" : "#3182F6",
  };

  const verifyBtnStyle: React.CSSProperties = {
    ...s.rightBtn,
    border: canVerify ? "1px solid #0066FF" : "1px solid #3182F6",
    color: canVerify ? "#0066FF" : "#3182F6",
  };

  const nextBtnStyle: React.CSSProperties = {
    ...s.submitBase,
    background: canNext ? "#0066FF" : "#3182F6",
  };

  function handleClose() {
    navigate("/login", { replace: true });
  }

  async function handleSend() {
    setErrorMsg(null);
    setOkMsg(null);

    if (!emailOk) {
      setErrorMsg("이메일 형식을 확인해 주세요.");
      return;
    }

    setIsSending(true);
    try {
      // 실제 연동 시:
      // 연동 후 await fetch("/members/email/check", { ... })로 교체해야 함!
      const res = await mockSendEmailCode(email.trim());
      if (res.success) {
        setRemainSec(60);
        setSendLocked(true);
        setSent(true);
        setVerified(false);
        setCode("");
        setOkMsg("인증번호를 전송했습니다.");
      } else {
        setErrorMsg("이미 회원가입되어 있습니다. 로그인을 시도해주세요.");
      }
    } catch (e) {
      console.error(e);
      setErrorMsg("전송에 실패했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setIsSending(false);
    }
  }

  async function handleVerify() {
    setErrorMsg(null);
    setOkMsg(null);

    if (!sent) {
      setErrorMsg("먼저 인증번호를 전송해 주세요.");
      return;
    }
    if (code.length !== 6) {
      setErrorMsg("인증번호 6자리를 입력해 주세요.");
      return;
    }

    setIsVerifying(true);
    try {
      // 실제 연동 시:
      // await fetch("/auth/verify/email/check", { ... })
      const res = await mockVerifyEmailCode(email.trim(), code);
      if (res.success) {
        setVerified(true);
        setOkMsg("인증이 완료되었습니다.");
      } else {
        setVerified(false);
        setErrorMsg("잘못된 인증번호입니다.");
      }
    } catch (e) {
      console.error(e);
      setErrorMsg("인증 확인에 실패했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setIsVerifying(false);
    }
  }

  function handleNext(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);
    setOkMsg(null);

    if (!birthOk) {
      setErrorMsg("생년월일 6자리를 입력해 주세요.");
      return;
    }
    if (!rr1Ok) {
      setErrorMsg("주민등록번호 뒤 1자리를 입력해 주세요.");
      return;
    }
    if (!verified) {
      setErrorMsg("이메일 인증을 완료해 주세요.");
      return;
    }
    navigate("/signup/password");
  }

  return (
    <div style={s.page}>
      <div style={{ ...s.card, paddingTop: "50px" }}>
        {/* 나가기 버튼 */}
        <button
          type="button"
          style={s.closeBtn}
          aria-label="나가기"
          onClick={handleClose}
        >
          <FindIdXIcon />
        </button>

        {/* 제목 */}
        <div style={s.title}>
          <div style={{ ...getTextStyle(700, 22, "#000000"), lineHeight: 1.3 }}>
            자주 사용하는 방법으로
            <br />
            시작하세요.
          </div>
        </div>

        <form onSubmit={handleNext}>
          {/* 생년월일 + 주민1 */}
          <div style={s.fieldBlock}>
            <div style={s.labelRow}>
              <div style={getTextStyle(400, 12, "#4D4D4D")}>생년월일</div>
            </div>

            <div style={s.rowBirth}>
              <div style={{ ...s.inputWrap, ...s.birthInput }}>
                <input
                  style={s.input}
                  value={birth}
                  onChange={(e) =>
                    setBirth(onlyDigits(e.target.value).slice(0, 6))
                  }
                  placeholder="741205"
                  inputMode="numeric"
                  maxLength={6}
                />
              </div>

              <div style={{ color: "#BFBFBF" }}>-</div>

              <div style={s.rowBirth}>
                <div style={{ ...s.inputWrap, ...s.rrFrontWrap }}>
                  <input
                    style={{ ...s.input, ...s.rrFrontInput }}
                    value={rr1}
                    onChange={(e) =>
                      setRr1(onlyDigits(e.target.value).slice(0, 1))
                    }
                    placeholder="1"
                    inputMode="numeric"
                    maxLength={1}
                  />
                </div>

                <div style={s.rrMask}>
                  <span>*</span>
                  <span>*</span>
                  <span>*</span>
                  <span>*</span>
                  <span>*</span>
                  <span>*</span>
                </div>
              </div>
            </div>
          </div>

          {/* 이메일 + 전송하기 */}
          <div style={s.fieldBlock}>
            <div style={s.labelRow}>
              <div style={getTextStyle(400, 12, "#4D4D4D")}>
                이메일{" "}
                <div style={{ marginLeft: "3px" }}>
                  <QuestionIcon />
                </div>
              </div>
            </div>

            <div style={s.rowEmail}>
              <div style={s.emailInputWrap}>
                <span style={s.leftIcon}>
                  <EmailBoxIcon />
                </span>
                <input
                  style={{ ...s.input, paddingLeft: 35 }}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setSent(false);
                    setVerified(false);
                    setCode("");
                  }}
                  placeholder="example@naver.com"
                  autoComplete="email"
                  disabled={isSending || isVerifying}
                />
              </div>

              <button
                type="button"
                style={sendBtnStyle}
                onClick={handleSend}
                disabled={!canSend}
              >
                {sendLocked ? `${remainSec}s` : "전송하기"}
              </button>
            </div>
          </div>

          {/* 인증번호 + 확인하기 */}
          <div style={s.fieldBlock}>
            <div style={s.labelRow}>
              <div style={getTextStyle(400, 12, "#4D4D4D")}>
                인증 번호 입력하기
              </div>
            </div>

            <div style={s.rowVerify}>
              <div style={s.emailInputWrap}>
                <span style={s.leftIcon}>
                  <EmailBoxIcon />
                </span>
                <input
                  style={{ ...s.input, paddingLeft: 35 }}
                  value={code}
                  onChange={(e) =>
                    setCode(onlyDigits(e.target.value).slice(0, 6))
                  }
                  placeholder="인증번호 6글자"
                  inputMode="numeric"
                  maxLength={6}
                  disabled={!sent || isVerifying}
                />
              </div>

              <button
                type="button"
                style={verifyBtnStyle}
                onClick={handleVerify}
                disabled={!canVerify}
              >
                확인하기
              </button>
            </div>
          </div>

          {/* 다음으로 */}
          <button type="submit" style={nextBtnStyle} disabled={!canNext}>
            <div style={getTextStyle(600, 14, "#FFFFFF")}>다음으로</div>
          </button>
        </form>

        {errorMsg && <div style={s.error}>{errorMsg}</div>}
        {/* {okMsg && <div style={s.success}>{okMsg}</div>} */}

        {/* 약관 */}
        <div style={s.footer}>
          <div style={s.agreeRow}>
            <div style={{ flexShrink: 0 }}>
              <QuestionIcon />
            </div>
            <div style={{ textAlign: "left" }}>
              ‘다음으로’를 클릭하실 경우 인증을 위해 인증주체에서 요구하는
              <br />
              개인정보 수집 및 이용, 고유식별정보 처리, 서비스 이용약관,
              <br />
              통신사 이용약관, 개인정보 제3자 제공에 대한 동의합니다.
            </div>
          </div>
          <div style={s.agreeRow}>
            <div style={{ flexShrink: 0 }}>
              <QuestionIcon />
            </div>
            <div style={{ textAlign: "left" }}>
              계정 생성 시 서비스 이용을 위한 필수 항목인 서비스 이용약관과
              <br />
              개인정보 처리방침에 동의합니다.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
