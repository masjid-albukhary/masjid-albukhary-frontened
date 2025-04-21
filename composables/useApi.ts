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

// Token management utilities
const TokenService = {
    getToken: () => {
        // Try to get from cookie first
        const tokenCookie = useCookie('token');
        if (tokenCookie.value) return tokenCookie.value;

        // Fallback to localStorage if cookie is not available
        if (process.client) {
            return localStorage.getItem('auth_token');
        }
        return null;
    },

    getRefreshToken: () => {
        // Try to get from cookie first
        const refreshTokenCookie = useCookie('refresh_token');
        if (refreshTokenCookie.value) return refreshTokenCookie.value;

        // Fallback to localStorage if cookie is not available
        if (process.client) {
            return localStorage.getItem('auth_refresh_token');
        }
        return null;
    },

    saveTokens: (accessToken: string, refreshToken: string) => {
        // Save in cookies with proper settings
        const accessTokenCookie = useCookie('token', {
            maxAge: 60 * 60 * 24, // 1 day
            path: '/',
            sameSite: 'lax', // Changed to lax for better compatibility
        });

        const refreshTokenCookie = useCookie('refresh_token', {
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: '/',
            sameSite: 'lax', // Changed to lax for better compatibility
        });

        accessTokenCookie.value = accessToken;
        refreshTokenCookie.value = refreshToken;

        // Also save in localStorage as backup
        if (process.client) {
            localStorage.setItem('auth_token', accessToken);
            localStorage.setItem('auth_refresh_token', refreshToken);
        }
    },

    clearTokens: () => {
        // Clear cookies
        const accessTokenCookie = useCookie('token', { path: '/' });
        const refreshTokenCookie = useCookie('refresh_token', { path: '/' });

        accessTokenCookie.value = null;
        refreshTokenCookie.value = null;

        // Clear localStorage
        if (process.client) {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('auth_refresh_token');
        }
    }
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
        withCredentials: true, // Important for cross-domain cookie transmission
    });

    api.interceptors.request.use((config) => {
        const accessToken = TokenService.getToken();
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

            // Add a flag to prevent infinite loops
            if (originalRequest?._retry) {
                return Promise.reject(error);
            }

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

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const refreshToken = TokenService.getRefreshToken();

                if (!refreshToken) {
                    throw new Error('No refresh token available');
                }

                const response = await api.post('/token/refresh/', {refresh: refreshToken});

                // Save tokens to both cookies and localStorage
                TokenService.saveTokens(
                    response.data.access,
                    response.data.refresh || refreshToken // Use new refresh if provided, otherwise keep existing
                );

                // Update authorization header for the original request
                originalRequest.headers['Authorization'] = `Bearer ${response.data.access}`;

                processQueue();
                return api(originalRequest);
            } catch (refreshError) {
                // Clear auth data and redirect to login
                TokenService.clearTokens();
                processQueue(refreshError);

                // Only navigate to login if in client side
                if (process.client) {
                    navigateTo('/user-login');
                }

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

// Add this auth plugin for global state management
export const useAuth = () => {
    const isAuthenticated = ref(!!TokenService.getToken());

    const login = (accessToken: string, refreshToken: string) => {
        TokenService.saveTokens(accessToken, refreshToken);
        isAuthenticated.value = true;
    };

    const logout = () => {
        TokenService.clearTokens();
        isAuthenticated.value = false;
        navigateTo('/user-login');
    };

    const checkAuth = () => {
        isAuthenticated.value = !!TokenService.getToken();
        return isAuthenticated.value;
    };

    return {
        isAuthenticated,
        login,
        logout,
        checkAuth
    };
};