// import type { AxiosError, AxiosRequestConfig } from 'axios';
// import axios from 'axios';
// import { useCookie, navigateTo } from '#app';
//
// let isRefreshing = false;
// let failedQueue: any[] = [];
//
// const processQueue = (error: any = null) => {
//     failedQueue.forEach(promise => {
//         if (error) {
//             promise.reject(error);
//         } else {
//             promise.resolve();
//         }
//     });
//     failedQueue = [];
// };
//
// function getBaseUrl() {
//     if (typeof window !== 'undefined') {
//         const isLocalhost = window.location.hostname === 'localhost' ||
//             window.location.hostname === '127.0.0.1';
//         return isLocalhost
//             ? 'http://127.0.0.1:8001/api'
//             : 'https://masjid-albukhary-backend-production.up.railway.app/api';
//     }
//
//     return process.env.API_BASE_URL || 'http://127.0.0.1:8001/api';
// }
//
// export function createApi() {
//     const baseUrl = getBaseUrl();
//
//     const api = axios.create({
//         baseURL: baseUrl,
//     });
//
//     api.interceptors.request.use(
//         (config) => {
//             const publicEndpoints = ['', ''];
//
//             if (publicEndpoints.some(endpoint => config.url?.includes(endpoint))) {
//                 return config;
//             }
//
//             const accessToken = useCookie('token').value;
//             if (accessToken) {
//                 config.headers = config.headers || {};
//                 config.headers['Authorization'] = `Bearer ${accessToken}`;
//             }
//             return config;
//         },
//         (error) => {
//             return Promise.reject(error);
//         }
//     );
//
//     api.interceptors.response.use(
//         (response) => response,
//         async (error: AxiosError) => {
//             const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
//
//             const publicEndpoints = ['/public', '/news'];
//             if (!originalRequest ||
//                 error.response?.status !== 401 ||
//                 originalRequest._retry ||
//                 publicEndpoints.some(endpoint => originalRequest.url?.includes(endpoint))) {
//                 return Promise.reject(error);
//             }
//
//             if (isRefreshing) {
//                 return new Promise((resolve, reject) => {
//                     failedQueue.push({ resolve, reject });
//                 }).then(() => api(originalRequest))
//                     .catch(err => Promise.reject(err));
//             }
//
//             originalRequest._retry = true;
//             isRefreshing = true;
//
//             try {
//                 const refreshToken = useCookie('refresh_token').value;
//                 if (!refreshToken) {
//                     throw new Error('No refresh token');
//                 }
//
//                 const response = await api.post('/token/refresh/', {
//                     refresh: refreshToken,
//                 });
//
//                 const newAccessToken = response.data.access;
//                 const newRefreshToken = response.data.refresh;
//
//                 // Updated to use the same path as the login function
//                 useCookie('token', {
//                     path: '/',
//                     maxAge: 60 * 60 * 24 * 7,
//                     secure: process.env.NODE_ENV === 'production',
//                     sameSite: 'lax', // or 'strict' if appropriate
//                 }).value = newAccessToken;
//
//                 useCookie('refresh_token', {
//                     path: '/',
//                     maxAge: 60 * 60 * 24 * 30,
//                     secure: process.env.NODE_ENV === 'production',
//                     sameSite: 'lax',
//                 }).value = newRefreshToken;
//
//                 if (originalRequest.headers) {
//                     originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
//                 }
//
//                 processQueue();
//                 return api(originalRequest);
//             } catch (refreshError) {
//                 useCookie('token', { path: '/' }).value = null;
//                 useCookie('refresh_token', { path: '/' }).value = null;
//                 navigateTo('/user-login');
//                 processQueue(refreshError);
//                 return Promise.reject(refreshError);
//             } finally {
//                 isRefreshing = false;
//             }
//         }
//     );
//
//     return api;
// }
//
// export function useApi() {
//     return createApi();
// }
//



import type {AxiosInstance, AxiosError} from "axios";
import axios from "axios";

let isRefreshing = false;
let failedQueue: any[] = [];

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
    const config = useRuntimeConfig();

    const baseUrl = config.public.isDev
        ? 'http://127.0.0.1:8000/api'
        : 'https://masjid-albukhary-backend-production.up.railway.app/api';

    return constructApi(baseUrl);
}

function constructApi(baseUrl: string): AxiosInstance {
    const api = axios.create({
        baseURL: baseUrl,
    });

    api.interceptors.request.use((config) => {
        const accessToken = useCookie('token').value
        if (accessToken) {
            config.headers = config.headers || {};
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        return config;
    }, (error) => {
        return Promise.reject(error);
    });

    api.interceptors.response.use(
        (response) => response,
        async (error: AxiosError) => {
            const originalRequest: any = error.config;

            if (error.response?.status !== 401 || originalRequest?.url?.includes('refresh')) {
                return Promise.reject(error);
            }

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({resolve, reject});
                })
                    .then(() => api(originalRequest))
                    .catch((err) => Promise.reject(err));
            }

            isRefreshing = true;

            try {
                const refreshToken = useCookie('refresh_token').value;
                const response = await api.post('/token/refresh/', {refresh: refreshToken});

                const accessTokenCookie = useCookie('token');
                const refreshTokenCookie = useCookie('refresh_token');

                accessTokenCookie.value = response.data.access;
                if (response.data.refresh) {
                    refreshTokenCookie.value = response.data.refresh;
                }

                originalRequest.headers['Authorization'] = `Bearer ${response.data.access_token}`;

                processQueue();

                return api(originalRequest);
            } catch (refreshError) {
                const accessTokenCookie = useCookie('access_token');
                const refreshTokenCookie = useCookie('refresh_token');

                accessTokenCookie.value = null;
                refreshTokenCookie.value = null;

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