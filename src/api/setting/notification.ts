import {
    type EditNotificationResponse,
    type EditNotificationRequest,
    type NotificationPreferenceResponse
} from "../../types/setting/notification"
import { axiosInstance } from "../core/axiosInstance"

// 알림 설정 보기
export const getNotificationPreference = async (token: string) => {
    const res = await axiosInstance.get<NotificationPreferenceResponse>(
        "/api/v1/preferences/members/notifications",
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
    );
    return res.data;
}

// 알림 설정 수정
export const patchEditNotification = async (token: string, body: EditNotificationRequest) => {
    const res = await axiosInstance.patch<EditNotificationResponse>(
        "/api/v1/preferences/members/notifications",
        null,
        {
            headers: { Authorization: `Bearer ${token}` },
            params: {
                reminderAlert: body.reminderAlert,
                kakaoAlert: body.kakaoAlert,
                emailAlert: body.emailAlert,
            },
        },
    );
    return res.data;
}