import {
    type NicknameCheckResponse,
    type NicknameCheckRequest,
    type WithdrawResponse,
    type EditProfileRequest,
    type EditProfileResponse,
    type MyInfoResponse
} from "../../types/setting/profile";
import { axiosInstance } from "../core/axiosInstance";

// 닉네임 중복 확인
export const postNicknameCheck = async (body: NicknameCheckRequest) => {
    const res = await axiosInstance.post<NicknameCheckResponse>("/api/v1/members/nickname/check", body);
    return res.data;
}

// 회원 탈퇴
export const patchWithdraw = async (token: string) => {
    const res = await axiosInstance.patch<WithdrawResponse>(
        "/api/v1/members/withdraw",
        null,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
    );
    return res.data;
}

// 프로필 정보 수정
export const patchEditProfile = async (body: EditProfileRequest) => {
    const form = new FormData();
    if (body.profileImage) form.append("profileImage", body.profileImage);
    if (body.nickName !== undefined) form.append("nickName", body.nickName);

    const res = await axiosInstance.patch<EditProfileResponse>(
        "/api/v1/members/profile",
        form,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        },
    );
    return res.data;
}

// 내 정보 보기
export const getMyInfo = async () => {
    const res = await axiosInstance.get<MyInfoResponse>("/api/v1/members/me");
    return res.data;
}