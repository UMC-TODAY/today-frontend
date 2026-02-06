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