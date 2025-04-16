import type { AxiosError, AxiosRequestConfig } from 'axios';
import axios from 'axios';
import { useCookie, navigateTo, useRuntimeConfig } from '#app';

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

export function createApi() {
    const config = useRuntimeConfig();
    const baseUrl = config.public.apiBase;

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
            console.error('Request error:', error);
            return Promise.reject(error);
        }
    );

    api.interceptors.response.use(
        (response) => response,
        async (error: AxiosError) => {
            const originalRequest = error.config as AxiosRequestConfig;

            if (!originalRequest || error.response?.status !== 401 || originalRequest?.url?.includes('refresh')) {
                return Promise.reject(error);
            }

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then(() => api(originalRequest))
                    .catch((err) => Promise.reject(err));
            }

            isRefreshing = true;

            try {
                const refreshToken = useCookie('refresh_token').value;

                if (!refreshToken) {
                    console.error('No refresh token found. Redirecting to login.');
                    navigateTo('/login');
                    return Promise.reject(new Error('No refresh token'));
                }

                const response = await api.post('/token/refresh/', {
                    refresh: refreshToken,
                });

                const newAccessToken = response.data.access;
                const newRefreshToken = response.data.refresh;

                useCookie('token', { path: '/' }).value = newAccessToken;
                useCookie('refresh_token', { path: '/' }).value = newRefreshToken;

                if (originalRequest.headers) {
                    originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                }

                processQueue();

                return api(originalRequest);
            } catch (refreshError) {
                useCookie('token', { path: '/' }).value = null;
                useCookie('refresh_token', { path: '/' }).value = null;

                console.error('Token refresh failed. Redirecting to login.');
                navigateTo('/login');

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
