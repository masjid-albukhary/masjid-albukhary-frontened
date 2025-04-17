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

// Store the base URL to ensure consistency across requests
let cachedBaseUrl: string | null = null;

function getBaseUrl() {
    // Return cached URL if already determined to ensure consistency
    if (cachedBaseUrl) {
        return cachedBaseUrl;
    }

    if (typeof window !== 'undefined') {
        const isLocalhost = window.location.hostname === 'localhost' ||
            window.location.hostname === '127.0.0.1';

        cachedBaseUrl = isLocalhost
            ? 'http://127.0.0.1:8001/api'
            : 'https://masjid-albukhary-backend-production.up.railway.app/api';

        return cachedBaseUrl;
    }

    cachedBaseUrl = process.env.API_BASE_URL || 'http://127.0.0.1:8001/api';
    return cachedBaseUrl;
}

// More reliable token management
function getTokens() {
    return {
        accessToken: useCookie('token').value,
        refreshToken: useCookie('refresh_token').value
    };
}

function saveTokens(accessToken: string, refreshToken: string) {
    // Set cookies with proper expiration and path
    useCookie('token', {
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        sameSite: 'lax'
    }).value = accessToken;

    useCookie('refresh_token', {
        path: '/',
        maxAge: 60 * 60 * 24 * 30, // 30 days
        sameSite: 'lax'
    }).value = refreshToken;

    // Backup to localStorage as fallback
    if (typeof window !== 'undefined') {
        try {
            localStorage.setItem('backup_token', accessToken);
            localStorage.setItem('backup_refresh_token', refreshToken);
        } catch (e) {
            console.error('Failed to backup tokens to localStorage:', e);
        }
    }
}

function clearTokens() {
    useCookie('token', { path: '/' }).value = null;
    useCookie('refresh_token', { path: '/' }).value = null;

    if (typeof window !== 'undefined') {
        localStorage.removeItem('backup_token');
        localStorage.removeItem('backup_refresh_token');
    }
}

export function createApi() {
    const baseUrl = getBaseUrl();
    console.log('API Base URL:', baseUrl);

    const api = axios.create({
        baseURL: baseUrl,
        withCredentials: true,
    });

    api.interceptors.request.use(
        (config) => {
            // Ensure baseURL is consistent
            config.baseURL = getBaseUrl();

            const publicEndpoints = ['', ''];
            if (publicEndpoints.some(endpoint => config.url?.includes(endpoint))) {
                return config;
            }

            const { accessToken } = getTokens();
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

            const publicEndpoints = ['/', '/'];
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
                const { refreshToken } = getTokens();
                if (!refreshToken) {
                    throw new Error('No refresh token');
                }

                // Create a separate instance for token refresh to avoid circular issues
                const tokenApi = axios.create({
                    baseURL: getBaseUrl(),
                    withCredentials: true
                });

                console.log('Attempting token refresh with refresh token');

                const response = await tokenApi.post('/token/refresh/', {
                    refresh: refreshToken,
                });

                if (!response.data.access || !response.data.refresh) {
                    console.error('Invalid refresh response:', response.data);
                    throw new Error('Invalid token refresh response');
                }

                const newAccessToken = response.data.access;
                const newRefreshToken = response.data.refresh;

                console.log('Token refresh successful, updating tokens');

                // Save new tokens
                saveTokens(newAccessToken, newRefreshToken);

                if (originalRequest.headers) {
                    originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                }

                processQueue();
                return api(originalRequest);
            } catch (refreshError) {
                console.error('Token refresh error:', refreshError);

                // Only clear tokens and redirect if it's truly an auth error
                if (
                    (refreshError as AxiosError).response?.status === 401 ||
                    (refreshError as AxiosError).response?.status === 403
                ) {
                    console.log('Auth error during refresh, logging out');
                    clearTokens();
                    // Add a small delay before navigation to ensure tokens are cleared
                    setTimeout(() => {
                        navigateTo('/user-login');
                    }, 100);
                } else {
                    console.error('Token refresh failed but keeping session:', refreshError);
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

// Singleton pattern to ensure consistent API instance
let apiInstance: ReturnType<typeof createApi> | null = null;

export function useApi() {
    if (!apiInstance) {
        // Try to recover tokens from localStorage if cookies are missing
        if (typeof window !== 'undefined') {
            const accessToken = useCookie('token').value;
            const refreshToken = useCookie('refresh_token').value;

            if (!accessToken || !refreshToken) {
                const backupToken = localStorage.getItem('backup_token');
                const backupRefreshToken = localStorage.getItem('backup_refresh_token');

                if (backupToken && backupRefreshToken) {
                    console.log('Recovering tokens from backup');
                    saveTokens(backupToken, backupRefreshToken);
                }
            }
        }

        apiInstance = createApi();
    }
    return apiInstance;
}

// Export token utilities
export const tokenUtils = {
    getTokens,
    saveTokens,
    clearTokens
};