import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signupStyles as s } from "../../styles/auth/signupStyles";
import { getTextStyle } from "../../styles/auth/loginStyles";
import QuestionIcon from "../../components/icons/QuestionIcon";
import EmailBoxIcon from "../../components/icons/EmailBoxIcon";
import FindIdXIcon from "../../components/icons/findIdXIcon";
import { useMutation } from "@tanstack/react-query";
import {
  postEmailCheck,
  postEmailVerifyCodeCheck,
  postEmailVerifyCodeSend,
} from "../../api/auth/auth";

function dateFormatFromRRN(birth: string, rr1: string) {
  if (birth.length !== 6 || rr1.length !== 1) return "";

  const yy = birth.slice(0, 2);
  const mm = birth.slice(2, 4);
  const dd = birth.slice(4, 6);

  const n = rr1;
  let century = "19";
  if (["3", "4", "7", "8"].includes(n)) century = "20";
  else if (["9", "0"].includes(n)) century = "18";

  const m = Number(mm);
  const d = Number(dd);
  if (m < 1 || m > 12) return "";
  if (d < 1 || d > 31) return "";

  return `${century}${yy}-${mm}-${dd}`;
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function onlyDigits(v: string) {
  return v.replace(/\D/g, "");
}

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

  const emailCodeSendMutation = useMutation({
    mutationFn: () => postEmailVerifyCodeSend({ email: email.trim() }),
    onSuccess: (result) => {
      if (result.isSuccess) {
        setRemainSec(60);
        setSendLocked(true);
        setCode("");
        setOkMsg(null);
        setErrorMsg(null);
        emailCodeCheckMutation.reset();
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

      console.error("이메일 인증코드 발송 에러 상세:", error.response?.data);
    },
  });

  const emailCodeCheckMutation = useMutation({
    mutationFn: () =>
      postEmailVerifyCodeCheck({
        email: email.trim(),
        "verify-code": code.trim(),
      }),
    onSuccess: (result) => {
      if (result.isSuccess) {
        setOkMsg("인증이 완료되었습니다.");
      }
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      const status = error.response?.status;

      if (status === 400) {
        setErrorMsg("잘못된 인증번호입니다.");
      } else {
        setErrorMsg("서버와의 연결에 실패했습니다.");
      }
      console.error("이메일 인증코드 확인 에러 상세:", error.response?.data);
    },
  });

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [_okMsg, setOkMsg] = useState<string | null>(null);

  const birthOk = useMemo(() => birth.length === 6, [birth]);
  const rr1Ok = useMemo(() => rr1.length === 1, [rr1]);
  const emailOk = useMemo(() => isValidEmail(email.trim()), [email]);

  const isSending = emailCodeSendMutation.isPending;
  const isVerifying = emailCodeCheckMutation.isPending;
  const sent = emailCodeSendMutation.isSuccess;
  const verified = emailCodeCheckMutation.isSuccess;

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

    if (sendLocked && remainSec > 0) return;

    try {
      const checkRes = await postEmailCheck({ email: email.trim() });

      if (checkRes.isSuccess) {
        emailCodeSendMutation.mutate();
      } 
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const status = error.response?.status;

      if (status === 400) {
        setErrorMsg("이미 회원가입되어 있습니다. 로그인을 시도해주세요.");
        return;
      }

      setErrorMsg("서버와의 연결에 실패했습니다.");
      console.error("이메일 중복 확인 에러 상세:", error.response?.data);
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

    emailCodeCheckMutation.mutate();
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

    const dateFormatBirth = dateFormatFromRRN(birth, rr1);
    if (!dateFormatBirth) {
      setErrorMsg("생년월일을 다시 확인해 주세요.");
      return;
    }

    navigate("/signup/password", {
      replace: true,
      state: { email: email.trim(), birth: dateFormatBirth },
    });
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
                    setCode("");
                    setOkMsg(null);
                    setErrorMsg(null);
                    emailCodeSendMutation.reset();
                    emailCodeCheckMutation.reset();
                    setRemainSec(0);
                    setSendLocked(false);
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
