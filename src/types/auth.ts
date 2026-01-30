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