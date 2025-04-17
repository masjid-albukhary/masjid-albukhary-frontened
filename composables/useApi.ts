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

export function createApi() {
    const baseUrl = process.env.API_BASE_URL || 'http://127.0.0.1:8001/api';

    const api = axios.create({
        baseURL: baseUrl,
    });

    api.interceptors.request.use(
        (config) => {
            // Skip auth header for public endpoints
            const publicEndpoints = ['/public', '/news']; // Add your public endpoints
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

            // Skip interception for public endpoints or non-401 errors
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
                navigateTo('/user-login'); // Changed from '/login' to '/user-login'
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