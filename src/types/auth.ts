// 이메일 로그인
export interface EmailLoginRequest {
    email: string;
    password: string;
};

export interface EmailLoginSuccessResponse {
    isSuccess: boolean;
    errorCode?: string;
    message: string;
    data: {
        accessToken: string;
        refreshToken: string;
    };
};

export interface EmailLoginErrorResponse {
    isSuccess: boolean;
    errorCode: string;
    message: string;
};

export type EmailLoginResponse = EmailLoginSuccessResponse | EmailLoginErrorResponse;

// 이메일 중복 확인
export interface EmailCheckRequest {
    email: string;
}

export interface EmailCheckSuccessResponse {
    isSuccess: boolean;
    message: string;
}

export interface EmailCheckErrorResponse {
    isSuccess: boolean;
    errorCode: string;
    message: string;
}

export type EmailCheckResponse = EmailCheckSuccessResponse | EmailCheckErrorResponse;

// 이메일 인증코드 발송 + 비밀번호 재설정 인증코드 발송
export interface VerifyRequest {
    email: string;
}

export interface VerifySuccessResonponse {
    isSuccess: boolean;
    message: string;
}

export interface VerifyErrorResonponse {
    isSuccess: boolean;
    errorCode: string;
    message: string;
}

export type VerifyResponse = VerifySuccessResonponse | VerifyErrorResonponse;

// 이메일 인증코드 확인 + 비밀번호 재설정 인증코드 확인
export interface VerifyCheckRequest {
    email: string;
    "verify-code": string;
}

export interface VerifyCheckSuccessResponse {
    isSuccess: boolean;
    message: string;
}

export interface VerifyCheckErrorResponse {
    isSuccess: boolean;
    errorCode: string;
    message: string;
}

export type VerifyCheckResponse = VerifyCheckSuccessResponse | VerifyCheckErrorResponse;

// 이메일 회원가입
export interface EmailSignupRequest {
    email: string;
    password: string;
    birth: string;
}

export interface EmailSignupSuccessResponse {
    isSuccess: boolean;
    message: string;
}

export interface EmailSignupErrorResponse {
    isSuccess: boolean;
    errorCode: string;
    message: string;
}

export type EmailSignupResponse = EmailSignupSuccessResponse | EmailSignupErrorResponse;

// 비밀번호 재설정
export interface ResetPasswordRequest {
    email: string;
    password: string;
}

export interface ResetPasswordSuccessResponse {
    isSuccess: boolean;
    message: string;
}

export interface ResetPasswordErrorResponse {
    isSuccess: boolean;
    errorCode: string;
    message: string;
}

export type ResetPasswordResponse = ResetPasswordSuccessResponse | ResetPasswordErrorResponse;