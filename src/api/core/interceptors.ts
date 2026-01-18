import type { AxiosInstance } from "axios";

export const setupInterceptors = (instance: AxiosInstance) => {
  instance.interceptors.request.use(
    (config) => config,
    (error) => Promise.reject(error),
  );

  instance.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(error),
  );

  return instance;
};
