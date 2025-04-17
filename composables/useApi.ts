import type {AxiosError, AxiosRequestConfig} from 'axios';
import axios from 'axios';
import {useCookie, navigateTo} from '#app';

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

// Cookie configuration - centralized for consistency
const TOKEN_COOKIE_CONFIG = {
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
    sameSite: 'strict' as const,
    secure: process.env.NODE_ENV === 'production',
};

const REFRESH_TOKEN_COOKIE_CONFIG = {
    ...TOKEN_COOKIE_CONFIG,
    maxAge: 60 * 60 * 24 * 30,
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

            const accessToken = useCookie('token').value;
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
                    failedQueue.push({resolve, reject});
                }).then(() => api(originalRequest))
                    .catch(err => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const refreshToken = useCookie('refresh_token').value;
                if (!refreshToken) {
                    throw new Error('No refresh token');
                }

                const response = await api.post('/token/refresh/', {
                    refresh: refreshToken,
                });

                const newAccessToken = response.data.access;
                const newRefreshToken = response.data.refresh;

                const tokenCookie = useCookie('token', TOKEN_COOKIE_CONFIG);
                const refreshTokenCookie = useCookie('refresh_token', REFRESH_TOKEN_COOKIE_CONFIG);

                tokenCookie.value = newAccessToken;
                refreshTokenCookie.value = newRefreshToken;

                if (originalRequest.headers) {
                    originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                }

                processQueue();
                return api(originalRequest);
            } catch (refreshError) {

                const tokenCookie = useCookie('token', TOKEN_COOKIE_CONFIG);
                const refreshTokenCookie = useCookie('refresh_token', REFRESH_TOKEN_COOKIE_CONFIG);

                tokenCookie.value = null;
                refreshTokenCookie.value = null;

                navigateTo('/user-login');
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