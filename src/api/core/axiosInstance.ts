import axios from "axios";
import { setupInterceptors } from "./interceptors.ts";

export const axiosInstance = setupInterceptors(
  axios.create({
    baseURL: "https://today-app.co.kr",
    timeout: 5000,
    headers: {
      "Content-Type": "application/json",
    },
  }),
);
