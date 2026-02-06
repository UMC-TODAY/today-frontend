import {
    type PrivacyInfoResponse,
    type EditPrivacyInfoRequest
} from "../../types/setting/privacy"
import { axiosInstance } from "../core/axiosInstance"

// 개인정보 및 분석설정 보기
export const getPrivacyInfo = async (token: string) => {
    const res = await axiosInstance.get<PrivacyInfoResponse>(
        "/api/preferences/members/info",
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
    );
    return res.data;
}

// 개인정보 및 분석설정 수정
export const patchEditPrivacyInfo = async (token: string, body: EditPrivacyInfoRequest) => {
    const res = await axiosInstance.patch(
        "/api/preferences/members/info",
        null,
        {
            headers: { Authorization: `Bearer ${token}` },
            params: { 
                privacyScope: body.privacyScope,
                dataUse: body.dataUse,
             },
        },
    );
    return res.data;
}