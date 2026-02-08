// iCloud 캘린더 연동
export interface ICloudIntegrationRequest {
    icsUrl: string;
}

export interface ICloudIntegrationSuccessResponse {
    isSuccess: boolean;
    message: string;
}

export interface ICloudIntegrationErrorResponse {
    isSuccess: boolean;
    errorCode: string;
    message: string;
}

export type ICloudIntegrationResponse = ICloudIntegrationSuccessResponse | ICloudIntegrationErrorResponse;

// notion 연동 인가 URL 발급
export interface NotionIntegrationSuccessResponse {
    isSuccess: boolean;
    message: string;
    data: {
        authorizeUrl: string;
    };
}

export interface NotionIntegrationErrorResponse {
    code: string;
    message: string;
}

export type NotionIntegrationResponse = NotionIntegrationSuccessResponse | NotionIntegrationErrorResponse;

// notion 연동 콜백 처리
export interface NotionCallbackSuccessResponse {
    isSuccess: boolean;
    message: string;
}

export interface NotionCallbackErrorResponse {
    isSuccess: boolean;
    errorCode?: string;
    message: string;
}

export type NotionCallbackResponse = | NotionCallbackSuccessResponse | NotionCallbackErrorResponse;

// google 캘린더 연동 인가 URL 발급
export interface GoogleIntegrationSuccessResponse {
    isSuccess: boolean;
    message: string;
    data: {
        authorizeUrl: string;
    };
}

export interface GoogleIntegrationErrorResponse {
    code: string;
    message: string;
}

export type GoogleIntegrationResponse = GoogleIntegrationSuccessResponse | GoogleIntegrationErrorResponse;

// google 연동 콜백 처리
export interface GoogleCallbackSuccessResponse {
    isSuccess: boolean;
    message: string;
}

export interface GoogleCallbackErrorResponse {
    isSuccess: boolean;
    errorCode?: string;
    message: string;
}

export type GoogleCallbackResponse = GoogleCallbackSuccessResponse | GoogleCallbackErrorResponse;