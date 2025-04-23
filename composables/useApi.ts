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
        headers: {
            'Content-Type': 'application/json',
        },
    });

    api.interceptors.request.use(
        (config) => {
            // Add all your public endpoints here
            const publicEndpoints = [
                'about',
                'contact',
                'gallery',
                'index',
                'services-form',
                'user-login',
                'facilities',
                'activities',
                'auth/login',
                'auth/register',
                'public',
                'news'
            ];

            if (publicEndpoints.some(endpoint => config.url?.includes(endpoint))) {
                return config;
            }

            if (process.client) {
                const accessToken = useCookie('token').value;
                if (accessToken) {
                    config.headers = config.headers || {};
                    config.headers['Authorization'] = `Bearer ${accessToken}`;
                }
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

            // Skip interception for these cases
            if (!originalRequest ||
                error.response?.status !== 401 ||
                originalRequest._retry) {
                return Promise.reject(error);
            }

            // Add endpoints that shouldn't trigger refresh
            const skipRefreshEndpoints = [
                'about',
                'contact',
                'gallery',
                'index',
                'services-form',
                'user-login',
                'facilities',
                'activities',
                'auth/login',
                'auth/register',
                'auth/logout'
            ];

            if (skipRefreshEndpoints.some(endpoint => originalRequest.url?.includes(endpoint))) {
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
                    throw new Error('No refresh token available');
                }

                const response = await api.post('/auth/refresh/', {
                    refresh: refreshToken,
                });

                const newAccessToken = response.data.access;
                const newRefreshToken = response.data.refresh;

                // Set cookies with consistent configuration
                useCookie('token', {
                    path: '/',
                    maxAge: 60 * 60 * 24 * 7, // 1 week
                    sameSite: 'lax',
                    secure: process.env.NODE_ENV === 'production',
                }).value = newAccessToken;

                useCookie('refresh_token', {
                    path: '/',
                    maxAge: 60 * 60 * 24 * 30, // 1 month
                    sameSite: 'lax',
                    secure: process.env.NODE_ENV === 'production',
                }).value = newRefreshToken;

                if (originalRequest.headers) {
                    originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                }

                processQueue();
                return api(originalRequest);
            } catch (refreshError) {
                // Clear cookies on refresh failure
                useCookie('token', { path: '/' }).value = null;
                useCookie('refresh_token', { path: '/' }).value = null;

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