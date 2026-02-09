import { useLocation, useNavigate } from "react-router-dom";
import FindIdXIcon from "../../components/icons/findIdXIcon";
import QuestionIcon from "../../components/icons/QuestionIcon";
import { authCommenStyles as s } from "../../styles/auth/authCommonStyles";
import { getTextStyle } from "../../styles/auth/loginStyles";
import { useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { patchResetPassword } from "../../api/auth/auth";
import { patchChangePassword } from "../../api/setting/profile";
import { getAccessToken } from "../../utils/tokenStorage";

function isValidPassword(pw: string) {
  // 8~32자 검증
  if (pw.length < 8 || pw.length > 32) return false;

  // 영문, 숫자, 특수문자 조합 검증
  const hasLetter = /[A-Za-z]/.test(pw);
  const hasNumber = /[0-9]/.test(pw);
  const hasSpecial = /[^A-Za-z0-9]/.test(pw);
  const isCombined = hasLetter && hasNumber && hasSpecial;

  // 3자 이상 연속된 동일 문자 및 숫자 제외 로직
  const has3Reapting = /(.)\1{2,}/.test(pw);

  return isCombined && !has3Reapting;
}

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state;

  const email = state.email ?? "";
  const from = state.from ?? "";

  const token = getAccessToken() || "";

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

  const resetPasswordMutation = useMutation({
    mutationFn: () =>
      patchResetPassword({ email: email.trim(), password: pw.trim() }),
    onSuccess: (result) => {
      if (result.isSuccess) {
        navigate("/login");
      } else {
        setErrorMsg("비밀번호 재설정에 실패했습니다.");
      }
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      const status = error.response?.status;

      if (status === 400) {
        setErrorMsg("비밀번호 재설정에 실패했습니다.");
      } else {
        setErrorMsg("서버와의 연결에 실패했습니다.");
      }

      console.error("비밀번호 재설정 에러 상세:", error.response?.data);
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: () => patchChangePassword(token, { password: pw.trim() }),
    onSuccess: (result) => {
      if (result.isSuccess) {
        navigate("/dashboard?settings=profile", { replace: true });
      } else {
        setErrorMsg("비밀번호 재설정에 실패했습니다.");
      }
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      const errorCode = error.response?.data.errorCode;

      if (errorCode === "PASSWORD_400") {
        setErrorMsg(error.response?.data.message);
      } else if (errorCode === "COMMON002") {
        setErrorMsg("비밀번호 재설정에 실패했습니다.");
      } else {
        setErrorMsg("서버와의 연결에 실패했습니다.");
      }

      console.error("비밀번호 재설정 에러 상세:", error.response?.data);
    },
  });

  function handleClose() {
    if (from === "profile-setting") {
      navigate("/dashboard?settings=profile", { replace: true });
    } else {
      navigate("/login");
    }
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

    if (from === "profile-setting") {
      changePasswordMutation.mutate();
    } else {
      resetPasswordMutation.mutate();
    }
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
        <div style={{ ...getTextStyle(700, 24, "#000000"), ...s.title }}>
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
