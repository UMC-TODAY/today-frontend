import {
    type EmailLoginResponse,
    type EmailLoginRequest,
    type EmailCheckRequest,
    type EmailCheckResponse,
    type EmailVerifyRequest,
    type EmailVerifyResponse,
    type EmailVerifyCheckRequest,
    type EmailVerifyCheckResponse
} from "../../types/auth";
import { axiosInstance } from "../core/axiosInstance";

// 이메일 로그인
export const postEmailLogin = async (body: EmailLoginRequest) => {
    const res = await axiosInstance.post<EmailLoginResponse>("/api/auth/login/email", body);
    return res.data;
}

// 이메일 중복 확인
export const postEmailCheck = async (body: EmailCheckRequest) => {
    const res = await axiosInstance.post<EmailCheckResponse>("/api/auth/email/check", body);
    return res.data;
}

// 이메일 인증코드 발송
export const postEmailVerifyCodeSend = async (body: EmailVerifyRequest) => {
    const res = await axiosInstance.post<EmailVerifyResponse>("/api/auth/email/verification-codes", body);
    return res.data;
}

// 이메일 인증코드 확인
export const postEmailVerifyCodeCheck = async (body: EmailVerifyCheckRequest) => {
    const res = await axiosInstance.post<EmailVerifyCheckResponse>("/api/auth/email/verification-codes/verify", body);
    return res.data;
}