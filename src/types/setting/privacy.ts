// 개인정보 및 분석설정 보기
export interface PrivacyInfoSuccessResponse {
    isSuccess: boolean
    message: string;
    data: {
        privacyScope: string; // FRIEND or PRIVATE (대문자!)
        dataUse: boolean;
    }

}

export interface PrivacyInfoErrorResponse {
    code: string;
    message: string;
}

export type PrivacyInfoResponse = PrivacyInfoSuccessResponse | PrivacyInfoErrorResponse;

// 개인정보 및 분석설정 수정
export interface EditPrivacyInfoRequest {
    privacyScope: string;
    dataUse: boolean;
}

export interface EditPrivacyInfoSuccessResponse {
    isSuccess: boolean;
    message: string;
}
export interface EditPrivacyInfoErrorResponse {
    code: string;
    message: string;
}

export type EditPrivacyInfoResponse = EditPrivacyInfoSuccessResponse | EditPrivacyInfoErrorResponse;