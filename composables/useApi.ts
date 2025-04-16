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
        : 'https://fypbackend-production-d0dd.up.railway.app/api';

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