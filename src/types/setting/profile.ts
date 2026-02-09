// 닉네임 중복 확인
export interface NicknameCheckRequest {
    nickname: string;
}

export interface NicknameCheckSuccessResponse {
    isSuccess: boolean;
    message: string;
}

export interface NicknameCheckErrorResponse {
    isSuccess: boolean;
    errorCode: string;
    message: string;
}

export type NicknameCheckResponse = NicknameCheckSuccessResponse | NicknameCheckErrorResponse;

// 회원 탈퇴 (response만)
export interface WithdrawSuccessResponse {
    isSuccess: boolean;
    message: string;
}

export interface WithdrawErrorResponse {
    isSuccess: boolean;
    errorCode: string;
    message: string;
}

export type WithdrawResponse = WithdrawSuccessResponse | WithdrawErrorResponse;

// 프로필 정보 수정
export interface EditProfileRequest {
    profileImage: File | null;
    nickName: string;
}

export interface EditProfileSuccessResponse {
    isSuccess: boolean;
    message: string;
}

export interface EditProfileErrorResponse {
    isSuccess: boolean;
    errorCode: string;
    message: string;
}

export type EditProfileResponse = EditProfileSuccessResponse | EditProfileErrorResponse;

// 내 정보 보기 (response만)
export interface MyInfoResponse {
    isSuccess: boolean;
    message: string;
    data: {
        memberId: number;
        nickname: string;
        profileImage: string;
        email: string;
    }
}

// 비밀번호 변경
export interface ChangePasswordRequest {
    password: string;
}

export interface ChangePasswordSuccessResponse {
    isSuccess: boolean;
    message: string;
}

export interface ChangePasswordErrorResponse {
    isSuccess: boolean;
    errorCode: string;
    message: string;
}

export type ChangePasswordResponse = ChangePasswordSuccessResponse | ChangePasswordErrorResponse;