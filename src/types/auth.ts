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

export interface EmailCheckResponse {
    isSuccess: boolean;
    errorCode: string;
    message: string;
    data: Record<string, never>;
}

// 이메일 인증코드 발송
export interface EmailVerifyRequest {
    email: string;
}

export interface EmailVerifySuccessResonponse {
    isSuccess: boolean;
    message: string;
}

export interface EmailVerifyErrorResonponse {
    isSuccess: boolean;
    errorCode: string;
    message: string;
}

export type EmailVerifyResponse = EmailVerifySuccessResonponse | EmailVerifyErrorResonponse;

// 이메일 인증코드 확인
export interface EmailVerifyCheckRequest {
    email: string;
    verify_code: string;
}

export interface EmailVerifyCheckSuccessResponse {
    isSuccess: boolean;
    message: string;
}

export interface EmailVerifyCheckErrorResponse {
    isSuccess: boolean;
    errorCode: string;
    message: string;
}

export type EmailVerifyCheckResponse = EmailVerifyCheckSuccessResponse | EmailVerifyCheckErrorResponse;