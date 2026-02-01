import {
    type EmailLoginResponse,
    type EmailLoginRequest,
    type EmailCheckRequest,
    type EmailCheckResponse,
    type VerifyRequest,
    type VerifyResponse,
    type VerifyCheckRequest,
    type VerifyCheckResponse,
    type EmailSignupRequest,
    EmailSignupResponse
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

// 비밀번호 재설정 인증코드 발송
export const postPasswordVerifyCodeSend = async (body: VerifyRequest) => {
    const res = await axiosInstance.post<VerifyResponse>("/api/auth/password/verification-codes", body);
    return res.data;
}

// 비밀번호 재설정 인증코드 확인
export const postPasswordVerifyCodeCheck = async (body: VerifyCheckRequest) => {
    const res = await axiosInstance.post<VerifyCheckResponse>("/api/auth/password/verification-codes/verify", body);
    return res.data;
}

// 이메일 인증코드 발송
export const postEmailVerifyCodeSend = async (body: VerifyRequest) => {
    const res = await axiosInstance.post<VerifyResponse>("/api/auth/email/verification-codes", body);
    return res.data;
}

// 이메일 인증코드 확인
export const postEmailVerifyCodeCheck = async (body: VerifyCheckRequest) => {
    const res = await axiosInstance.post<VerifyCheckResponse>("/api/auth/email/verification-codes/verify", body);
    return res.data;
}

// 이메일 회원가입
export const postEmailSignup = async (body: EmailSignupRequest) => {
    const res = await axiosInstance.post<EmailSignupResponse>("/api/auth/signup/email", body);
    return res.data;
}