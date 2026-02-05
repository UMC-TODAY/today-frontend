// 알림 설정 보기
export interface NotificationPreferenceSuccessResponse {
    isSuccess: boolean;
    message: string;
    data: {
        reminderAlert: boolean;
        kakaoAlert: boolean;
        emailAlert: boolean;
    }
}

export interface NotificationPreferenceErrorResponse {
    code: string;
    message: string;
}

export type NotificationPreferenceResponse = NotificationPreferenceSuccessResponse | NotificationPreferenceErrorResponse;

// 알람 설정 수정
export interface EditNotificationRequest {
    reminderAlert: boolean;
    kakaoAlert: boolean;
    emailAlert: boolean;
}

export interface EditNotificationSuccessResponse {
    isSuccess: boolean;
    message: string;
}

export interface EditNotificationErrorResponse {
    code: string;
    message: string;
}

export type EditNotificationResponse = EditNotificationSuccessResponse | EditNotificationErrorResponse;