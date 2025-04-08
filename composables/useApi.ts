import type { AxiosError, AxiosRequestConfig } from "axios";
import axios from "axios";

// Store to manage the token refresh process
let isRefreshing = false;
let failedQueue: any[] = [];

// Function to process queued failed requests after token refresh
const processQueue = (error: any = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve();
        }
    });
    failedQueue = [];
};

export function createApi() {
    const baseUrl = process.env.API_BASE_URL || 'http://127.0.0.1:8000/api';

    const api = axios.create({
        baseURL: baseUrl,
    });

    api.interceptors.request.use(
        (config) => {
            const accessToken = useCookie('token').value;
            if (accessToken) {
                config.headers = config.headers || {};
                config.headers['Authorization'] = `Bearer ${accessToken}`;
            } else {
                console.warn('No access token found. Please log in again.');
            }
            return config;
        },
        (error) => {
            console.error("Request error:", error);
            return Promise.reject(error);
        }
    );

    api.interceptors.response.use(
        (response) => response,
        async (error: AxiosError) => {
            const originalRequest = error.config as AxiosRequestConfig;

            // If originalRequest doesn't exist, just reject the promise
            if (!originalRequest) {
                return Promise.reject(error);
            }

            // If the error is not related to token expiration, reject it
            if (error.response?.status !== 401 || originalRequest?.url?.includes('refresh')) {
                return Promise.reject(error);
            }

            // Handle token refresh if we are already refreshing the token
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then(() => api(originalRequest))
                    .catch((err) => Promise.reject(err));
            }

            // Mark refreshing flag as true
            isRefreshing = true;

            try {
                const refreshToken = useCookie('refresh_token').value;
                if (!refreshToken) {
                    console.error('No refresh token found. Redirecting to login.');
                    navigateTo('/login');
                    return Promise.reject(new Error('No refresh token'));
                }

                const response = await api.post('/token/refresh/', { refresh: refreshToken });

                const accessTokenCookie = useCookie('token');
                const refreshTokenCookie = useCookie('refresh_token');

                // Update the cookies with the new tokens
                accessTokenCookie.value = response.data.access;
                if (response.data.refresh) {
                    refreshTokenCookie.value = response.data.refresh;
                }

                // Set the Authorization header for the original request
                if (originalRequest?.headers) {
                    originalRequest.headers['Authorization'] = `Bearer ${response.data.access}`;
                }

                // Process any failed requests in the queue after refresh
                processQueue();

                // Retry the original request with the new token
                return api(originalRequest);
            } catch (refreshError) {
                // In case of refresh failure, clear tokens and navigate to login
                const accessTokenCookie = useCookie('token');
                const refreshTokenCookie = useCookie('refresh_token');

                accessTokenCookie.value = null;
                refreshTokenCookie.value = null;

                console.error("Token refresh failed, logging out.");
                navigateTo('/login');

                return Promise.reject(refreshError);
            } finally {
                // Mark the refreshing process as complete
                isRefreshing = false;
            }
        }
    );

    return api;
}

export function useApi() {
    return createApi();
}
