import { 
    type ICloudIntegrationResponse, 
    type ICloudIntegrationRequest 
} from "../../types/setting/calendar";
import { axiosInstance } from "../core/axiosInstance";

// iCloud 캘린더 연동
export const postICloudIntegration = async (body: ICloudIntegrationRequest) => {
    const res = await axiosInstance.post<ICloudIntegrationResponse>("/api/v1/preferences/integrations/icloud/connections", body);
    return res.data;
}