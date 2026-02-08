import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getTextStyle } from "../../styles/auth/loginStyles";
import { authCommenStyles as s } from "../../styles/auth/authCommonStyles";
import { getMyInfo, patchWithdraw } from "../../api/setting/profile";
import { clearAuth, getAccessToken } from "../../utils/tokenStorage";

export default function WithdrawPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const fromPanel = useMemo(() => {
    const qs = new URLSearchParams(location.search);
    return qs.get("from") || "profile";
  }, [location.search]);

  // 아이디(이메일) 표시용
  const { data: me } = useQuery({
    queryKey: ["me", "profile"],
    queryFn: getMyInfo,
    staleTime: 0,
  });

  const email = me?.isSuccess ? (me.data.email ?? "") : "";

  const [agree1, setAgree1] = useState(false);
  const [agree2, setAgree2] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const canWithdraw = useMemo(() => agree1 && agree2, [agree1, agree2]);

  const withdrawMutation = useMutation({
    mutationFn: () => {
      const token = getAccessToken() || "";
      if (!token) throw new Error("no token");
      return patchWithdraw(token);
    },
    onSuccess: (result) => {
      if (result.isSuccess) {
        clearAuth();

        navigate("/login", { replace: true });
      }
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      if (error?.message === "no token") {
        setErrorMsg("로그인이 만료되었습니다. 다시 로그인해 주세요.");
        navigate("/login", { replace: true });
        return;
      } else {
        setErrorMsg("서버와의 연결에 실패했습니다.");
      }

      console.error("회원 탈퇴 에러 상세:", error?.response.data);
    },
  });

  const withdrawBtnStyle: React.CSSProperties = {
    width: "280px",
    height: "32px",
    borderRadius: "10px",
    marginTop: "14px",
    background: canWithdraw ? "#3182F6" : "#5C92FF",
    cursor: canWithdraw ? "pointer" : "not-allowed",
  };

  const backBtnStyle: React.CSSProperties = {
    width: "280px",
    height: "32px",
    borderRadius: "10px",
    background: "#FFFFFF",
    border: "1px solid #3182F6",
    cursor: "pointer",
    marginTop: "12px",
  };

  function handleBack() {
    navigate(`/dashboard?settings=${fromPanel}`, { replace: true });
  }

  async function handleWithdraw() {
    if (!canWithdraw) return;

    setErrorMsg(null);
    withdrawMutation.mutate();
  }

  return (
    <div style={s.page}>
      <div
        style={{
          width: "500px",
          height: "600px",
          background: "#FFFFFF",
          borderRadius: "12px",
          padding: "25px 40px 26px",
          position: "relative",
        }}
      >
        {/* 타이틀 */}
        <div
          style={{
            ...getTextStyle(650, 18, "#000000"),
            ...s.title,
            marginTop: "40px",
          }}
        >
          회원 탈퇴 전 아래 유의사항을 확인해주세요
        </div>

        {/* 아이디(이메일) */}
        <div
          style={{
            display: "flex",
            gap: "10px",
            justifyContent: "center",
            marginTop: "16px",
          }}
        >
          <div
            style={{
              ...getTextStyle(500, 12, "#4D4D4D"),
              marginTop: "5px",
              marginLeft: "8px",
            }}
          >
            아이디
          </div>

          <div style={{ ...s.inputWrap, marginTop: "8px" }}>
            <input
              style={{
                ...s.input,
                background: "#FFFFFF",
                color: "#4D4D4D",
                width: "200px",
              }}
              value={email}
              readOnly
              disabled
            />
          </div>
        </div>

        {/* 유의사항 */}
        <div
          style={{
            marginTop: "24px",
            background: "#F3F3F3",
            borderRadius: "10px",
            padding: "18px 26px",
            lineHeight: 1.5,
            fontSize: "11px",
            fontWeight: 330,
            color: "#000000",
          }}
        >
          <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
            <div style={{ marginTop: "2px" }}>•</div>
            <div>탈퇴 시 해당 계정으로 모든 서비스를 이용할 수 없습니다.</div>
          </div>

          <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
            <div style={{ marginTop: "2px" }}>•</div>
            <div>계정이 삭제된 이후에는 복구할 수 없습니다.</div>
          </div>

          <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
            <div style={{ marginTop: "2px" }}>•</div>
            <div>
              탈퇴 즉시, 같은 계정으로 7일 동안 다시 가입할 수 없습니다.
              <br />
              만약 이용 약관에 따라 회원 자격을 제한 또는 정지당한 회원이 그
              조치 기간에
              <br />
              탈퇴하는 경우에는 해당 조치 기간 동안은 다시 가입할 수 없습니다.
            </div>
          </div>

          <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
            <div style={{ marginTop: "2px" }}>•</div>
            <div>
              일정, 할일, 커뮤니티 기록 등 활동한 내역이 모두 삭제되며 복구할 수
              없습니다.
            </div>
          </div>

          <div style={{ display: "flex", gap: "8px" }}>
            <div style={{ marginTop: "2px" }}>•</div>
            <div>보유하고 계신 멤버십이 모두 소멸되며, 복구할 수 없습니다.</div>
          </div>
        </div>

        {/* 체크리스트 (둘 다 체크해야 함!) */}
        <div
          style={{
            marginTop: "8px",
            padding: "14px 8px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "11px",
              fontSize: "11px",
              color: "#4D4D4D",
              marginBottom: "16px",
            }}
          >
            <input
              type="checkbox"
              checked={agree1}
              onChange={(e) => setAgree1(e.target.checked)}
              style={{ marginTop: "1px", cursor: "pointer" }}
            />
            <div>
              유의 사항을 모두 확인하였으며, 회원 탈퇴 시 보유한 멤버십이
              소멸되는 것에 동의합니다.
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "11px",
              fontSize: "11px",
              color: "#4D4D4D",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              checked={agree2}
              onChange={(e) => setAgree2(e.target.checked)}
              style={{ marginTop: "1px", cursor: "pointer" }}
            />
            <div>계정은 탈퇴 후 복구할 수 없으며, 이에 동의합니다.</div>
          </div>
        </div>

        {/* 에러 메시지 */}
        {errorMsg && (
          <div
            style={{ marginTop: "12px", color: "#D93025", fontSize: "12px" }}
          >
            {errorMsg}
          </div>
        )}

        {/* 버튼들 */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <button
            type="button"
            style={{ ...withdrawBtnStyle, marginTop: "18px" }}
            disabled={!canWithdraw}
            onClick={handleWithdraw}
          >
            <div style={getTextStyle(550, 14, "#FFFFFF")}>탈퇴하기</div>
          </button>
          <button type="button" style={backBtnStyle} onClick={handleBack}>
            <div style={getTextStyle(550, 14, "#3182F6")}>돌아가기</div>
          </button>
        </div>
      </div>
    </div>
  );
}
