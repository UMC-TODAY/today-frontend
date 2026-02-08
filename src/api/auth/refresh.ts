import type { TokenReissueResponse } from "../../types/auth";
import { axiosInstance } from "../core/axiosInstance";

// 로그인 유지
export const postTokenReissue = async () => {
    const res = await axiosInstance.post<TokenReissueResponse>( "/api/v1/auth/token/reissue", null);
    return res.data;
}