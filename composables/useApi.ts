import type { AxiosError, AxiosRequestConfig } from 'axios';
import axios from 'axios';
import { useCookie, navigateTo } from '#app';

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any = null) => {
    failedQueue.forEach(promise => {
        if (error) {
            promise.reject(error);
        } else {
            promise.resolve();
        }
    });
    failedQueue = [];
};

const TOKEN_COOKIE_CONFIG = {
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    sameSite: 'strict' as const,
    secure: process.env.NODE_ENV === 'production',
};

const REFRESH_TOKEN_COOKIE_CONFIG = {
    ...TOKEN_COOKIE_CONFIG,
    maxAge: 60 * 60 * 24 * 30, // 30 days
};

function getBaseUrl() {
    if (typeof window !== 'undefined') {
        const isLocalhost = window.location.hostname === 'localhost' ||
            window.location.hostname === '127.0.0.1';
        return isLocalhost
            ? 'http://127.0.0.1:8001/api'
            : 'https://masjid-albukhary-backend-production.up.railway.app/api';
    }
    return process.env.API_BASE_URL || 'http://127.0.0.1:8001/api';
}

// Helper function to safely get cookies
function getCookie(name: string) {
    if (process.client) {
        return useCookie(name).value;
    }
    return null;
}

// Helper function to set cookies
function setCookie(name: string, value: string | null, config: any = TOKEN_COOKIE_CONFIG) {
    if (process.client) {
        const cookie = useCookie(name, config);
        cookie.value = value;
    }
}

export function createApi() {
    const baseUrl = getBaseUrl();

    const api = axios.create({
        baseURL: baseUrl,
        withCredentials: true,
    });

    const publicEndpoints = ['/public', '/news', '/login', '/token/refresh'];

    api.interceptors.request.use(
        (config) => {
            if (publicEndpoints.some(endpoint => config.url?.includes(endpoint))) {
                return config;
            }

            const accessToken = getCookie('token');
            if (accessToken) {
                config.headers = config.headers || {};
                config.headers['Authorization'] = `Bearer ${accessToken}`;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    api.interceptors.response.use(
        (response) => response,
        async (error: AxiosError) => {
            const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

            if (!originalRequest ||
                error.response?.status !== 401 ||
                originalRequest._retry ||
                publicEndpoints.some(endpoint => originalRequest.url?.includes(endpoint))) {
                return Promise.reject(error);
            }

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(() => api(originalRequest))
                    .catch(err => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const refreshToken = getCookie('refresh_token');
                if (!refreshToken) {
                    throw new Error('No refresh token');
                }

                const response = await api.post('/token/refresh/', {
                    refresh: refreshToken,
                });

                const newAccessToken = response.data.access;
                const newRefreshToken = response.data.refresh;

                setCookie('token', newAccessToken);
                setCookie('refresh_token', newRefreshToken, REFRESH_TOKEN_COOKIE_CONFIG);

                if (originalRequest.headers) {
                    originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                }

                processQueue();
                return api(originalRequest);
            } catch (refreshError) {
                setCookie('token', null);
                setCookie('refresh_token', null);

                if (process.client) {
                    navigateTo('/user-login');
                }

                processQueue(refreshError);
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

// Optional: Client-side initialization check
if (process.client) {
    const token = getCookie('token');
    const refreshToken = getCookie('refresh_token');

    if (!token && refreshToken) {
        const api = createApi();
        api.post('/token/refresh/', { refresh: refreshToken })
            .then(response => {
                setCookie('token', response.data.access);
                setCookie('refresh_token', response.data.refresh, REFRESH_TOKEN_COOKIE_CONFIG);
            })
            .catch(() => {
                setCookie('token', null);
                setCookie('refresh_token', null);
                navigateTo('/user-login');
            });
    }
}