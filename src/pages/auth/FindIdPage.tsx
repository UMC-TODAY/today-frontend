import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import FindIdXIcon from "../../components/icons/findIdXIcon";
import EmailBoxIcon from "../../components/icons/EmailBoxIcon";
import { authCommenStyles as s } from "../../styles/auth/authCommonStyles";
import { getTextStyle } from "../../styles/auth/loginStyles";
import QuestionIcon from "../../components/icons/QuestionIcon";
import { useMutation } from "@tanstack/react-query";
import { postEmailCheck } from "../../api/auth/auth";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function FindIdPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [okMsg, setOkMsg] = useState<string | null>(null);

  const canSubmit = useMemo(() => {
    if (!email.trim()) return false;
    if (!isValidEmail(email.trim())) return false;
    return true;
  }, [email]);

  const emailCheckMutation = useMutation({
    mutationFn: () => postEmailCheck({ email: email.trim() }),
    onSuccess: (result) => {
      setErrorMsg(null);
      setOkMsg(null);

      if (result.isSuccess) {
        setErrorMsg("해당 이메일의 회원 정보가 없습니다.");
      }
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      const status = error.response?.status;

      if (status === 400) {
        setErrorMsg("이미 해당 이메일로 회원가입되어 있습니다.");
      } else {
        setErrorMsg("서버와의 연결에 실패했습니다.");
      }

      console.error("이메일 중복 에러 상세:", error.response?.data);
    },
  });

  const isLoading = emailCheckMutation.isPending;

  const submitStyle: React.CSSProperties = {
    ...s.submitBase,
    background: canSubmit && !isLoading ? "#0066FF" : "#3182F6",
    cursor: canSubmit && !isLoading ? "pointer" : "not-allowed",
  };

  async function handleCheck(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);
    setOkMsg(null);

    if (!canSubmit) {
      setErrorMsg("이메일 형식을 확인해주세요.");
      return;
    }

    emailCheckMutation.mutate();
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
        <div style={{ ...getTextStyle(650, 28, "#000000"), ...s.title }}>이메일 주소 입력</div>
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
