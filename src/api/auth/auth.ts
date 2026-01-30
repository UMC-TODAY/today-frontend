import { type EmailLoginResponse, type EmailLoginRequest } from "../../types/auth";
import { axiosInstance } from "../core/axiosInstance";

export const postEmailLogin = async (body: EmailLoginRequest) => {
    const res = await axiosInstance.post<EmailLoginResponse>("/auth/login/email", body);
    return res.data;
}