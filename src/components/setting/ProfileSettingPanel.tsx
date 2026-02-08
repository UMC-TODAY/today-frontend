import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  getMyInfo,
  patchEditProfile,
  postNicknameCheck,
} from "../../api/setting/profile";
import { useEffect, useMemo, useRef, useState } from "react";
import { getTextStyle } from "../../styles/auth/loginStyles";
import CameraIcon from "../icons/CameraIcon";

type NameCheckStatus = "idle" | "ok" | "dup";

export default function ProfileSettingPanel({
  goWithdraw,
}: {
  goWithdraw: () => void;
}) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: me } = useQuery({
    queryKey: ["me", "profile"],
    queryFn: getMyInfo,
    staleTime: 0,
  });

  const fileRef = useRef<HTMLInputElement | null>(null);

  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [originImageUrl, setOriginImageUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [newImageUrl, setNewImageUrl] = useState<string | null>(null);
  const [nameCheckStatus, setNameCheckStatus] =
    useState<NameCheckStatus>("idle");
  const [nameCheckMsg, setNameCheckMsg] = useState<string | null>(null);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);

  // 사용자 정보를 가져온 순간 초기값 세팅
  useEffect(() => {
    if (!me?.isSuccess) return;
    setNickname(me.data.nickname ?? "");
    setEmail(me.data.email ?? "");
    setOriginImageUrl(me.data.profileImage ?? null);
    setSelectedFile(null);
    setNewImageUrl(null);
    setNameCheckStatus("idle");
    setNameCheckMsg(null);
    setSaveMsg(null);
  }, [me?.isSuccess, me?.data.nickname, me?.data.email, me?.data.profileImage]);

  // 닉네임 중복 확인 버튼 클릭 가능 여부
  const canCheckName = useMemo(() => nickname.trim().length >= 1, [nickname]);

  const isNicknameChanged =
    nickname.trim() !== (me?.isSuccess ? (me.data.nickname ?? "").trim() : "");
  const isImageChanged = !!selectedFile;

  // 저장 가능 여부
  const canSave = useMemo(() => {
    if (!me?.isSuccess) return false;
    if (!isNicknameChanged && !isImageChanged) return false;
    if (isNicknameChanged && nameCheckStatus !== "ok") return false;
    return true;
  }, [me?.isSuccess, isNicknameChanged, isImageChanged, nameCheckStatus]);

  const nicknameCheckMutation = useMutation({
    mutationFn: () => postNicknameCheck({ nickname: nickname.trim() }),
    onSuccess: (result) => {
      if (result.isSuccess) {
        setNameCheckStatus("ok");
        setNameCheckMsg("변경 가능한 프로필 이름입니다.");
      }
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      if (error?.response.data.errorCode === "MEMBER400_2") {
        setNameCheckStatus("dup");
        setNameCheckMsg(
          "이미 중복된 프로필 이름입니다.\n다른 프로필 이름을 사용해주세요.",
        );
      } else {
        setNameCheckStatus("idle");
        setNameCheckMsg("서버와의 연결에 실패했습니다.");
      }

      console.error("닉네임 중복 확인 에러 상세:", error?.response.data);
    },
  });

  const editProfileMutaion = useMutation({
    mutationFn: (payload: { profileImage: File | null; nickName: string }) =>
      patchEditProfile({
        profileImage: payload.profileImage ?? null,
        nickName: payload.nickName,
      }),
    onSuccess: async (result) => {
      if (!result.isSuccess) return;

      // sidebar에 있는 myInfo 쿼리 갱신
      queryClient.invalidateQueries({ queryKey: ["myInfo"] });
      setSaveMsg("저장되었습니다.");

      // 변경 플래그 리셋
      setSelectedFile(null);
      setNewImageUrl(null);
      setNameCheckStatus("idle");
      setNameCheckMsg(null);

      await queryClient.invalidateQueries({ queryKey: ["me", "profile"] });
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      console.error("프로필 정보 수정 에러 상세:", error?.response.data);
    },
  });

  const isLoading =
    nicknameCheckMutation.isPending || editProfileMutaion.isPending;

  function onPickImage() {
    fileRef.current?.click();
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;

    setSelectedFile(f);
    setNameCheckStatus("idle");
    setNameCheckMsg(null);
    setSaveMsg(null);

    const url = URL.createObjectURL(f);
    setNewImageUrl(url);
  }

  function onClickChangePassword() {
    navigate("/login/find-password/done");
  }

  function onClickWithdraw() {
    goWithdraw();
  }

  async function onClickSave() {
    setSaveMsg(null);

    if (nickname.trim().length === 0) {
      return;
    }

    try {
      if (isNicknameChanged) {
        const checkRes = await postNicknameCheck({ nickname: nickname.trim() });

        if (!checkRes.isSuccess) {
          setNameCheckStatus("dup");
          setNameCheckMsg(
            "이미 중복된 프로필 이름입니다. 다른 프로필 이름을 사용해주세요.",
          );
          return;
        }

        setNameCheckStatus("ok");
        setNameCheckMsg("변경 가능한 프로필 이름입니다.");
      }

      editProfileMutaion.mutate({
        profileImage: selectedFile,
        nickName: nickname.trim(),
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(error);
    }
  }

  const shownImage = newImageUrl ?? originImageUrl ?? null;

  return (
    <div>
      <div
        style={{
          ...getTextStyle(500, 16, "#6987D2"),
          marginTop: "20px",
          marginBottom: "44px",
        }}
      >
        프로필 설정
      </div>

      {/* 프로필 이미지 */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "14px",
          marginBottom: "18px",
        }}
      >
        <div style={{ position: "relative", width: "76px", height: "76px" }}>
          <div
            style={{
              width: "76px",
              height: "76px",
              borderRadius: "50%",
              background: "#FFFFFF",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {shownImage ? (
              <img
                src={shownImage}
                alt="profile"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  background: "#D6D6D6",
                }}
              />
            )}
          </div>

          <button
            type="button"
            onClick={onPickImage}
            disabled={isLoading}
            aria-label="프로필 이미지 변경"
            style={{
              position: "absolute",
              right: -8,
              bottom: -8,
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              border: "1px solid #D8D8D8",
              background: "#FFFFFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <CameraIcon />
          </button>

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={onFileChange}
          />
        </div>
      </div>

      {/* 프로필 이름 */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "15px",
          marginBottom: "25px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "140px 1fr 90px",
            gap: 10,
            alignItems: "center",
            marginTop: "25px",
            paddingLeft: "5px",
          }}
        >
          <div style={getTextStyle(450, 15, "#525050")}>프로필 이름</div>

          <input
            value={nickname}
            onChange={(e) => {
              setNickname(e.target.value);
              setNameCheckStatus("idle");
              setNameCheckMsg(null);
              setSaveMsg(null);
            }}
            disabled={isLoading}
            style={{
              height: "40px",
              borderRadius: "8px",
              border: "1px solid #D9D9D9",
              padding: "0 12px",
              outline: "none",
            }}
          />

          <button
            type="button"
            onClick={() => nicknameCheckMutation.mutate()}
            disabled={!isNicknameChanged || isLoading}
            style={{
              height: "40px",
              borderRadius: "12px",
              background: isNicknameChanged ? "#3182F6" : "#5C92FF",
              color: "#FFFFFF",
              fontWeight: 400,
              fontSize: "14px",
              cursor: !canCheckName || isLoading ? "not-allowed" : "pointer",
            }}
          >
            확인
          </button>
        </div>

        {nameCheckMsg && !saveMsg && (
          <div
            style={{
              marginLeft: "158px",
              fontSize: "13px",
              fontWeight: 600,
              color: nameCheckStatus === "ok" ? "#0066FF" : "#D93025",
            }}
          >
            {nameCheckMsg}
          </div>
        )}
      </div>

      {/* 이메일 (수정 불가!) */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "140px 1fr",
          gap: "10px",
          alignItems: "center",
          marginBottom: "25px",
          paddingLeft: "5px",
        }}
      >
        <div style={getTextStyle(450, 15, "#525050")}>이메일</div>
        <div
          style={{
            height: 40,
            borderRadius: "8px",
            border: "1px solid #D9D9D9",
            padding: "0 12px",
            background: "#FFFFFF",
            color: "#8D8D8D",
            fontSize: "14px",
            fontWeight: 400,
            display: "flex",
            alignItems: "center",
          }}
        >
          {email}
        </div>
      </div>

      {/* 비밀번호 변경 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "140px 1fr",
          gap: "10px",
          alignItems: "center",
          marginBottom: "15px",
          paddingLeft: "5px",
        }}
      >
        <div style={getTextStyle(450, 15, "#525050")}>비밀번호</div>
        <button
          type="button"
          onClick={onClickChangePassword}
          disabled={isLoading}
          style={{
            height: "40px",
            borderRadius: "20px",
            border: "0.6px solid #5C5C5C",
            background: "#FFFFFF",
            cursor: isLoading ? "not-allowed" : "pointer",
            width: 115,
            color: "#5C5C5C",
            fontSize: "14px",
            fontWeight: 400,
          }}
        >
          비밀번호 변경
        </button>
      </div>

      {saveMsg && (
        <div
          style={{
            textAlign: "right",
            marginRight: "30px",
            marginTop: "35px",
            fontSize: "13px",
            fontWeight: 600,
            color: "#0066FF",
          }}
        >
          {saveMsg}
        </div>
      )}

      {/* 하단 버튼 (회원탈퇴, 저장) */}
      <div
        style={{
          position: "absolute",
          left: "220px",
          right: 0,
          bottom: 0,
          padding: "20px 28px",
          borderTop: "1px solid #EAEAEA",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: "15px",
          background: "#FFFFFF",
        }}
      >
        <button
          type="button"
          onClick={onClickWithdraw}
          disabled={isLoading}
          style={{
            height: "38px",
            width: "100px",
            borderRadius: "12px",
            border: "1px solid #E54D52",
            background: "#FFFFFF",
            color: "#E54D52",
            fontWeight: 600,
            fontSize: "14px",
            cursor: isLoading ? "not-allowed" : "pointer",
          }}
        >
          회원탈퇴
        </button>

        <button
          type="button"
          onClick={onClickSave}
          disabled={!canSave}
          style={{
            height: "38px",
            width: "100px",
            borderRadius: "12px",
            background: canSave ? "#3182F6" : "#5C92FF",
            color: "#FFFFFF",
            fontWeight: 600,
            fontSize: "14px",
            cursor: isLoading ? "not-allowed" : "pointer",
          }}
        >
          저장
        </button>
      </div>
    </div>
  );
}
