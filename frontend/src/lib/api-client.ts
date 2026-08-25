import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { ApiResponse } from '@/types/api.types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT Token & Tenant Context
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const storedAuth = localStorage.getItem('prime_one_auth');
      if (storedAuth) {
        try {
          const parsed = JSON.parse(storedAuth);
          if (parsed.state?.tokens?.accessToken) {
            config.headers.Authorization = `Bearer ${parsed.state.tokens.accessToken}`;
          }
          if (parsed.state?.user?.companyId) {
            config.headers['X-Company-ID'] = parsed.state.user.companyId;
          }
        } catch {
          // ignore parsing error
        }
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle standardized response envelope and 401 unauth
apiClient.interceptors.response.use(
  (response) => {
    // Return data directly if nested in standard envelope
    return response.data;
  },
  async (error: AxiosError<ApiResponse>) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && typeof window !== 'undefined') {
      // Clear token and redirect to login if session expired
      console.warn('Unauthorized or session expired. Logging out.');
      // Optional: Trigger token refresh logic here
    }

    // Extract custom backend error message
    const customError = error.response?.data?.error;
    const errorMessage = customError?.message || error.message || 'An unexpected error occurred';

    return Promise.reject(new Error(errorMessage));
  }
);

export default apiClient;
