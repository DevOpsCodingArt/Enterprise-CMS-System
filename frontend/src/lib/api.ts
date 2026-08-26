import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import type { ApiResponse, ApiErrorEnvelope } from "@/types/api.types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Refresh token queue to prevent race conditions during concurrent 401s
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request Interceptor: Attach JWT & Tenant Context
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      try {
        const storedAuth = localStorage.getItem("prime-one-auth-storage");
        if (storedAuth) {
          const parsed = JSON.parse(storedAuth);
          const accessToken = parsed.state?.accessToken;
          const companyId = parsed.state?.company?.id;

          if (accessToken && config.headers) {
            config.headers.Authorization = `Bearer ${accessToken}`;
          }
          if (companyId && config.headers) {
            config.headers["X-Company-ID"] = companyId;
          }
        }
      } catch {
        // Safe local storage fallback
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Seamless Token Refresh & Error Normalization
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorEnvelope>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // If 401 Unauthorized and not already retrying
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        let refreshToken: string | null = null;
        if (typeof window !== "undefined") {
          const storedAuth = localStorage.getItem("prime-one-auth-storage");
          if (storedAuth) {
            refreshToken = JSON.parse(storedAuth).state?.refreshToken;
          }
        }

        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        const refreshResponse = await axios.post<ApiResponse<{ accessToken: string; refreshToken: string }>>(
          `${API_BASE_URL}/auth/refresh`,
          { refreshToken }
        );

        const newAccessToken = refreshResponse.data.data.accessToken;

        // Update local storage
        if (typeof window !== "undefined") {
          const storedAuth = localStorage.getItem("prime-one-auth-storage");
          if (storedAuth) {
            const parsed = JSON.parse(storedAuth);
            parsed.state.accessToken = newAccessToken;
            parsed.state.refreshToken = refreshResponse.data.data.refreshToken || refreshToken;
            localStorage.setItem("prime-one-auth-storage", JSON.stringify(parsed));
          }
        }

        processQueue(null, newAccessToken);
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }
        return apiClient(originalRequest);
      } catch (refreshErr) {
        processQueue(refreshErr as AxiosError, null);
        if (typeof window !== "undefined") {
          localStorage.removeItem("prime-one-auth-storage");
          // Optional soft redirect
        }
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
