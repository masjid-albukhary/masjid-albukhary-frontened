import type { AxiosError, AxiosRequestConfig } from 'axios';
import axios from 'axios';
import { useCookie, navigateTo } from '#app';

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
    const api = axios.create({ baseURL: baseUrl });

    api.interceptors.request.use(
        (config) => {
            // Add your public endpoints here
            const publicEndpoints = ['/', '/about', '/contact', '/public', '/news'];

            // Check if current URL is public
            const isPublic = publicEndpoints.some(endpoint =>
                config.url?.startsWith(endpoint) ||
                endpoint === config.url
            );

            if (isPublic) {
                return config;
            }

            // For protected routes, add the token
            const accessToken = useCookie('token', {
                path: '/',
                maxAge: 60 * 60 * 24 * 7, // 7 days
                sameSite: 'lax',
                secure: process.env.NODE_ENV === 'production'
            }).value;

            if (accessToken) {
                config.headers = config.headers || {};
                config.headers['Authorization'] = `Bearer ${accessToken}`;
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    api.interceptors.response.use(
        (response) => response,
        async (error: AxiosError) => {
            const originalRequest = error.config as AxiosRequestConfig;

            // Check if it's a public endpoint
            const publicEndpoints = ['/', '/about', '/contact', '/public', '/news'];
            const isPublic = publicEndpoints.some(endpoint =>
                originalRequest.url?.startsWith(endpoint) ||
                endpoint === originalRequest.url
            );

            // If 401 error and not public endpoint, redirect to login
            if (error.response?.status === 401 && !isPublic) {
                useCookie('token').value = null;
                if (typeof window !== 'undefined') { // Client-side only
                    navigateTo('/user-login');
                }
            }

            return Promise.reject(error);
        }
    );

    return api;
}

export function useApi() {
    return createApi();
}