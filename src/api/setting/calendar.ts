import {
    type ICloudIntegrationResponse,
    type ICloudIntegrationRequest,
    type NotionIntegrationResponse,
    type NotionCallbackResponse,
    type GoogleIntegrationResponse
} from "../../types/setting/calendar";
import { axiosInstance } from "../core/axiosInstance";

// iCloud 캘린더 연동
export const postICloudIntegration = async (token: string, body: ICloudIntegrationRequest) => {
    const res = await axiosInstance.post<ICloudIntegrationResponse>(
        "/api/v1/preferences/integrations/icloud/connections",
        body,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
    );
    return res.data;
}

// notion 연동 인가 URL 발급
export const postNotionIntegration = async (token: string) => {
    const res = await axiosInstance.post<NotionIntegrationResponse>(
        "/api/v1/preferences/integrations/notion/authorize",
        null,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
    );
    return res.data;
};

// notion 연동 콜백 처리
export const getNotionCallback = async (token: string, code: string, state: string) => {
    const res = await axiosInstance.get<NotionCallbackResponse>(
        "/api/v1/preferences/integrations/notion/callback",
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: { code, state }
        },
    );
    return res.data;
};

// google 캘린더 연동 인가 URL 발급
export const postGoogleIntegration = async (token: string) => {
    const res = await axiosInstance.post<GoogleIntegrationResponse>(
        "/api/v1/preferences/integrations/google/authorize",
        null,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
    );
    return res.data;
}

// notion 연동 콜백 처리
export const getGoogleCallback = async (token: string, code: string) => {
    const res = await axiosInstance.get<NotionCallbackResponse>(
        "/api/v1/preferences/integrations/google/callback",
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: { code }
        },
    );
    return res.data;
};

// csv 연동
export const postCsvUpload = async (token: string, file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await axiosInstance.post(
        "/api/v1/schedules/csv", 
        formData,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
        },
    );
    return res.data;
}