import axios from "axios";
import { setupInterceptors } from "./interceptors.ts";

export const axiosInstance = setupInterceptors(
  axios.create({
    baseURL: "https://today-app.co.kr",
    timeout: 5000,
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  }),
);
