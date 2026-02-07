import axios from "axios";
import type { TokenReissueRequest, TokenReissueResponse } from "../../types/auth";

// 로그인 유지
export const postTokenReissue = async (body: TokenReissueRequest) => {
    const res = await axios.post<TokenReissueResponse>(
        "/api/v1/auth/token/reissue", 
        body, 
        { headers: { "Content-Type": "application/json" } }
    );
    return res.data;
}