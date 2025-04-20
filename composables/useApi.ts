import type { AxiosError, AxiosRequestConfig } from 'axios';
import axios from 'axios';
import { useCookie, navigateTo } from '#app';

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any = null, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

function getBaseUrl() {
    if (process.client) {
        const isLocalhost = window.location.hostname === 'localhost' ||
            window.location.hostname === '127.0.0.1';
        return isLocalhost
            ? 'http://127.0.0.1:8001/api'
            : 'https://masjid-albukhary-backend-production.up.railway.app/api';
    }
    return process.env.API_BASE_URL || 'http://127.0.0.1:8001/api';
}

export function createApi() {
    const baseUrl = getBaseUrl();
    const api = axios.create({ baseURL: baseUrl });

    api.interceptors.request.use(
        (config) => {
            const publicEndpoints = ['', ''];

            if (publicEndpoints.some(endpoint => config.url?.includes(endpoint))) {
                return config;
            }

            // Only try to get token on client side
            if (process.client) {
                const accessToken = useCookie('token').value;
                if (accessToken) {
                    config.headers = config.headers || {};
                    config.headers['Authorization'] = `Bearer ${accessToken}`;
                }
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    api.interceptors.response.use(
        (response) => response,
        async (error: AxiosError) => {
            const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

            const publicEndpoints = ['/public', '/news'];
            if (!originalRequest ||
                error.response?.status !== 401 ||
                originalRequest._retry ||
                publicEndpoints.some(endpoint => originalRequest.url?.includes(endpoint))) {
                return Promise.reject(error);
            }

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then((token) => {
                    originalRequest.headers = originalRequest.headers || {};
                    originalRequest.headers['Authorization'] = `Bearer ${token}`;
                    return api(originalRequest);
                }).catch(err => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const refreshToken = useCookie('refresh_token').value;
                if (!refreshToken) {
                    throw new Error('No refresh token available');
                }

                const response = await axios.post(`${baseUrl}/token/refresh/`, {
                    refresh: refreshToken,
                });

                const newAccessToken = response.data.access;
                const newRefreshToken = response.data.refresh;

                // Set cookies with proper attributes
                const tokenCookie = useCookie('token', {
                    path: '/',
                    maxAge: 60 * 60 * 24 * 7, // 7 days
                    sameSite: 'lax',
                    secure: process.env.NODE_ENV === 'production',
                });
                tokenCookie.value = newAccessToken;

                const refreshTokenCookie = useCookie('refresh_token', {
                    path: '/',
                    maxAge: 60 * 60 * 24 * 30, // 30 days
                    sameSite: 'lax',
                    secure: process.env.NODE_ENV === 'production',
                });
                refreshTokenCookie.value = newRefreshToken;

                if (originalRequest.headers) {
                    originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                }

                processQueue(null, newAccessToken);
                return api(originalRequest);
            } catch (refreshError) {
                // Clear tokens but don't navigate on server side
                if (process.client) {
                    useCookie('token').value = null;
                    useCookie('refresh_token').value = null;
                    navigateTo('/user-login');
                }
                processQueue(refreshError, null);
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }
    );

    return api;
}

export function useApi() {
    return createApi();
}