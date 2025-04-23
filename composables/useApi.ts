import type { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import axios from 'axios'
import { useCookie, navigateTo } from '#app'

type FailedRequest = {
    resolve: (value: unknown) => void
    reject: (reason?: any) => void
}

export function useApi(): AxiosInstance {
    const baseUrl = getBaseUrl()
    const isRefreshing = ref(false)
    const failedQueue = ref<FailedRequest[]>([])

    const processQueue = (error?: any) => {
        failedQueue.value.forEach(promise => {
            if (error) {
                promise.reject(error)
            } else {
                promise.resolve()
            }
        })
        failedQueue.value = []
    }

    const api = axios.create({
        baseURL: baseUrl,
        headers: {
            'Content-Type': 'application/json',
        },
    })

    // Request interceptor
    api.interceptors.request.use(
        (config: AxiosRequestConfig) => {
            const publicEndpoints = ['/auth/login', '/public']

            if (publicEndpoints.some(endpoint => config.url?.includes(endpoint))) {
                return config
            }

            const token = useCookie('token').value
            if (token) {
                config.headers = config.headers || {}
                config.headers.Authorization = `Bearer ${token}`
            }
            return config
        },
        (error) => {
            return Promise.reject(error)
        }
    )

    // Response interceptor
    api.interceptors.response.use(
        (response: AxiosResponse) => response,
        async (error: AxiosError) => {
            const originalRequest = error.config as (AxiosRequestConfig & { _retry?: boolean }) | undefined

            // Skip refresh logic for certain conditions
            if (shouldSkipRefresh(originalRequest, error)) {
                return Promise.reject(error)
            }

            // Handle concurrent requests while refreshing
            if (isRefreshing.value) {
                return new Promise((resolve, reject) => {
                    failedQueue.value.push({ resolve, reject })
                })
                    .then(() => api(originalRequest!))
                    .catch(err => Promise.reject(err))
            }

            originalRequest!._retry = true
            isRefreshing.value = true

            try {
                const { accessToken, refreshToken } = await handleTokenRefresh()
                updateAuthCookies(accessToken, refreshToken)

                if (originalRequest?.headers) {
                    originalRequest.headers.Authorization = `Bearer ${accessToken}`
                }

                processQueue()
                return api(originalRequest!)
            } catch (refreshError) {
                // Only logout for specific errors
                if (shouldForceLogout(refreshError)) {
                    await handleLogout()
                }
                processQueue(refreshError)
                return Promise.reject(error) // Return original error
            } finally {
                isRefreshing.value = false
            }
        }
    )

    return api
}

// Helper functions
function getBaseUrl(): string {
    if (process.client) {
        const isLocalhost = window.location.hostname === 'localhost' ||
            window.location.hostname === '127.0.0.1'
        return isLocalhost
            ? 'http://localhost:8000/api'
            : 'https://your-production-api.com/api'
    }
    return process.env.API_BASE_URL || 'http://localhost:8000/api'
}

async function handleTokenRefresh(): Promise<{ accessToken: string; refreshToken: string }> {
    const refreshToken = useCookie('refresh_token').value
    if (!refreshToken) {
        throw new Error('No refresh token available')
    }

    try {
        const response = await axios.post(`${getBaseUrl()}/auth/refresh`, {
            refresh_token: refreshToken,
        })

        return {
            accessToken: response.data.access_token,
            refreshToken: response.data.refresh_token,
        }
    } catch (error) {
        throw error
    }
}

function updateAuthCookies(accessToken: string, refreshToken: string): void {
    const tokenCookie = useCookie('token', {
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
    })

    const refreshTokenCookie = useCookie('refresh_token', {
        path: '/',
        maxAge: 60 * 60 * 24 * 30, // 30 days
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
    })

    tokenCookie.value = accessToken
    refreshTokenCookie.value = refreshToken
}

async function handleLogout(): Promise<void> {
    // Clear auth cookies
    useCookie('token').value = null
    useCookie('refresh_token').value = null

    // Client-side only actions
    if (process.client) {
        // Store current route for post-login redirect
        const redirectCookie = useCookie('redirect_after_login', { path: '/' })
        redirectCookie.value = window.location.pathname

        // Avoid infinite redirect loops
        if (!window.location.pathname.startsWith('/user-login')) {
            navigateTo('/user-login')
        }
    }
}

function shouldSkipRefresh(
    request: (AxiosRequestConfig & { _retry?: boolean }) | undefined,
    error: AxiosError
): boolean {
    const publicEndpoints = ['/auth/login', '/public']
    return (
        !request ||
        error.response?.status !== 401 ||
        request._retry ||
        publicEndpoints.some(endpoint => request.url?.includes(endpoint))
    )
}

function shouldForceLogout(error: any): boolean {
    return (
        error.response?.status === 403 ||
        error.message === 'No refresh token available' ||
        error.response?.data?.code === 'token_invalid'
    )
}