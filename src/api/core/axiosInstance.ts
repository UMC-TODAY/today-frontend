import axios from "axios";
import { setupInterceptors } from "./interceptors.ts";

export const axiosInstance = setupInterceptors(
  axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 5000,
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  }),
);
