import type { AxiosError, AxiosRequestConfig } from 'axios'
import axios from 'axios'
import { useCookie, navigateTo } from '#app'

let isRefreshing = false
let failedQueue: Array<{ resolve: (value?: any) => void; reject: (reason?: any) => void }> = []

const processQueue = (error: any = null) => {
    failedQueue.forEach(promise => {
        error ? promise.reject(error) : promise.resolve()
    })
    failedQueue = []
}

function getBaseUrl() {
    if (typeof window !== 'undefined') {
        const isLocalhost = window.location.hostname === 'localhost' ||
            window.location.hostname === '127.0.0.1'
        return isLocalhost
            ? 'http://127.0.0.1:8001/api'
            : 'https://masjid-albukhary-backend-production.up.railway.app/api'
    }
    return process.env.API_BASE_URL || 'http://127.0.0.1:8001/api'
}

export function createApi() {
    const baseUrl = getBaseUrl()

    const api = axios.create({
        baseURL: baseUrl,
        withCredentials: true,
    })

    // Request interceptor
    api.interceptors.request.use(
        (config) => {
            const publicEndpoints = ['/login', '/register'] // Add your public endpoints

            if (publicEndpoints.some(endpoint => config.url?.includes(endpoint))) {
                return config
            }

            const token = process.client
                ? useCookie('token').value
                : useRequestHeaders(['cookie']).cookie?.match(/token=([^;]+)/)?.[1]

            if (token) {
                config.headers = config.headers || {}
                config.headers.Authorization = `Bearer ${token}`
            }
            return config
        },
        (error) => Promise.reject(error)
    )

    // Response interceptor
    api.interceptors.response.use(
        (response) => response,
        async (error: AxiosError) => {
            const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean }

            // Skip refresh logic for public endpoints or non-401 errors
            const publicEndpoints = ['/public', '/news']
            if (!originalRequest ||
                error.response?.status !== 401 ||
                originalRequest._retry ||
                publicEndpoints.some(endpoint => originalRequest.url?.includes(endpoint))) {
                return Promise.reject(error)
            }

            // Queue requests while refreshing
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject })
                }).then(() => api(originalRequest))
                    .catch(err => Promise.reject(err))
            }

            originalRequest._retry = true
            isRefreshing = true

            try {
                const refreshToken = process.client
                    ? useCookie('refresh_token').value
                    : useRequestHeaders(['cookie']).cookie?.match(/refresh_token=([^;]+)/)?.[1]

                if (!refreshToken) throw new Error('No refresh token available')

                // Refresh the access token (but keep same refresh token)
                const { data } = await axios.post(`${baseUrl}/token/refresh/`, {
                    refresh: refreshToken
                }, {
                    baseURL: '',
                    headers: { 'Content-Type': 'application/json' }
                })

                // Only update access token (keep original refresh token)
                const newAccessToken = data.access

                // Update token in cookies
                if (process.client) {
                    useCookie('token', {
                        path: '/',
                        maxAge: 60 * 60 * 24 * 7, // 1 week
                        sameSite: 'lax',
                        secure: process.env.NODE_ENV === 'production'
                    }).value = newAccessToken
                }

                // Update Authorization header
                if (originalRequest.headers) {
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
                }

                processQueue() // Retry queued requests
                return api(originalRequest)
            } catch (refreshError) {
                // Clear tokens and redirect to login on refresh failure
                if (process.client) {
                    useCookie('token').value = null
                    useCookie('refresh_token').value = null
                    navigateTo('/user-login')
                }
                processQueue(refreshError)
                return Promise.reject(refreshError)
            } finally {
                isRefreshing = false
            }
        }
    )

    return api
}

export function useApi() {
    return createApi()
}