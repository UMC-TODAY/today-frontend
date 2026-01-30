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