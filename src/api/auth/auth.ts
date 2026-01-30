import { type EmailLoginResponse, type EmailLoginRequest, type EmailCheckRequest, type EmailCheckResponse } from "../../types/auth";
import { axiosInstance } from "../core/axiosInstance";

export const postEmailLogin = async (body: EmailLoginRequest) => {
    const res = await axiosInstance.post<EmailLoginResponse>("/auth/login/email", body);
    return res.data;
}

export const postEmailCheck = async (body: EmailCheckRequest) => {
    const res = await axiosInstance.post<EmailCheckResponse>("/members/email/check", body);
    return res.data;
}