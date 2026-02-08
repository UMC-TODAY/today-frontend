import type { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { getAccessToken, setAccessToken, clearAuth } from "../../utils/tokenStorage";
import { postTokenReissue } from "../auth/refresh";

type RetryConfig = InternalAxiosRequestConfig & { _retry?: boolean };

export const setupInterceptors = (instance: AxiosInstance): AxiosInstance => {
  // request: accessToken 자동 첨부
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const accessToken = getAccessToken();
      if (accessToken) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error) => Promise.reject(error),
  );

  // 동시성 제어 변수들
  let isRefreshing = false;
  let refreshPromise: Promise<string> | null = null;
  const queue: Array<(token: string | null) => void> = [];

  // 대기하던 요청 수행
  function flushQueue(token: string | null) {
    queue.forEach((cb) => cb(token));
    queue.length = 0;
  }

  // response: 401이면 refresh 후 재시도
  instance.interceptors.response.use(
    (res) => res,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async (error: AxiosError<any>) => {
      const original = error.config as RetryConfig | undefined;
      const status = error.response?.status;

      // 401이 아니면 그대로 에러
      if (status !== 401 || !original) return Promise.reject(error);

      // 이미 재시도한 요청이면 그대로 에러
      if (original._retry) return Promise.reject(error);
      original._retry = true;

      // refresh 중이면 대기 큐에 넣기
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          queue.push((newToken) => {
            if (!newToken) return reject(error);

            original.headers = original.headers ?? {};
            original.headers.Authorization = `Bearer ${newToken}`;

            resolve(instance(original));
          });
        });
      }

      // refresh 시작
      isRefreshing = true;
      refreshPromise =
        refreshPromise ??
        (async () => {
          const res = await postTokenReissue();

          if (!res.isSuccess) {
            throw new Error("새 엑세스 토큰 발급에 실패했습니다.");
          }

          setAccessToken(res.data.accessToken);

          return res.data.accessToken;
        })();

      try {
        const newAccessToken = await refreshPromise;
        flushQueue(newAccessToken);

        original.headers = original.headers ?? {};
        original.headers.Authorization = `Bearer ${newAccessToken}`;
        return instance(original);
      } catch {
        flushQueue(null);
        clearAuth();
        window.location.replace("/login");
        return Promise.reject(error);
      } finally {
        isRefreshing = false;
        refreshPromise = null;
      }
    },
  );

  return instance;
};