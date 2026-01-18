import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import FindIdXIcon from "../../components/icons/findIdXIcon";
import EmailBoxIcon from "../../components/icons/EmailBoxIcon";
import { findIdStyles as s } from "../../styles/auth/findIdStyles";
import { getTextStyle } from "../../styles/auth/loginStyles";
import QuestionIcon from "../../components/icons/QuestionIcon";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

type EmailCheckSuccess = {
  success: true;
  message: string;
  data: Record<string, never>;
};

type EmailCheckFail = {
  success: false;
  code: string;
  message: string;
  data: { id: number };
};

type EmailCheckResponse = EmailCheckSuccess | EmailCheckFail;

/**
 * 개발 중 mock
 * - success:true  => (보통 "가입 안 됨" / "사용 가능" 의미)
 * - success:false => "이미 가입된 이메일입니다." (가입됨)
 */
const mockEmailCheckApi = (email: string): Promise<EmailCheckResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const isRegistered = email.trim().toLowerCase().endsWith("@naver.com");
      if (isRegistered) {
        resolve({
          success: false,
          code: "EMAIL_VEIFY400_1",
          message: "이미 가입된 이메일입니다.",
          data: { id: 1 },
        });
      } else {
        resolve({
          success: true,
          message: "요청이 성공적으로 처리되었습니다.",
          data: {},
        });
      }
    }, 500);
  });
};

export default function FindIdPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [okMsg, setOkMsg] = useState<string | null>(null);

  const canSubmit = useMemo(() => {
    if (!email.trim()) return false;
    if (!isValidEmail(email.trim())) return false;
    return true;
  }, [email]);

  const submitStyle: React.CSSProperties = {
    ...s.submitBase,
    background: canSubmit && !isLoading ? "#0066FF" : "#3182F6",
    cursor: canSubmit && !isLoading ? "pointer" : "not-allowed",
  };

  async function handleCheck(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);
    setOkMsg(null);

    setIsLoading(true);
    try {
      //   백엔드 연동 시 이 fetch 주석 해제하고 mock 제거
      //   const response = await fetch("/members/email/check", {
      //     method: "POST",
      //     headers: {
      //       "Content-Type": "application/json",
      //       Authorization: `Bearer ${token}`,
      //     },
      //       body: JSON.stringify({ email: email.trim() }),
      //   });
      //   const result: EmailCheckResponse = await response.json();

      const result = await mockEmailCheckApi(email);

      // - success:false + "이미 가입된 이메일입니다." => 가입된 이메일
      // - success:true  => 가입된 이메일이 아님
      if (result.success === false) {
        // 가입된 이메일
        setOkMsg("이미 해당 이메일로 회원가입되어 있습니다.");
      } else {
        // 가입되지 않은 이메일
        setErrorMsg("해당 이메일의 회원 정보가 없습니다.");
      }
    } catch (err) {
      console.error(err);
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
        <div style={getTextStyle(650, 28, "#000000")}>이메일 주소 입력</div>
        <div style={s.subtitle}>
          해당 이메일로 가입 여부를
          <br />
          확인해보세요.
        </div>

        <form onSubmit={handleCheck}>
          {/* 이메일 */}
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

          {/* 확인하기 */}
          <button
            type="submit"
            style={submitStyle}
            disabled={!canSubmit || isLoading}
          >
            <div style={getTextStyle(500, 14, "#FFFFFF")}>
              {isLoading ? "확인 중..." : "확인하기"}
            </div>
          </button>
        </form>

        {errorMsg && <div style={s.error}>{errorMsg}</div>}
        {okMsg && <div style={s.success}>{okMsg}</div>}
      </div>
    </div>
  );
}
