// ~/composables/useApi.ts
import type { AxiosError, AxiosRequestConfig } from 'axios'
import axios from 'axios'
import { useCookie, navigateTo } from '#app'

function getBaseUrl() {
    if (process.client) {
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
    const api = axios.create({ baseURL: baseUrl })

    // List of endpoints that don't require authentication
    const publicEndpoints = [
        '/token/',        // Login endpoint
        '/public',        // Public data
        '/news',          // News endpoints
        '/about',         // About page data
        '/contact'        // Contact endpoints
    ]

    api.interceptors.request.use(
        (config) => {
            // Skip adding token for public endpoints
            if (publicEndpoints.some(endpoint => config.url?.startsWith(endpoint))) {
                return config
            }

            // Add Authorization header for protected endpoints
            const token = useCookie('token', {
                path: '/',
                maxAge: 60 * 60 * 24 * 7, // 7 days
                sameSite: 'lax',
                secure: process.env.NODE_ENV === 'production'
            }).value

            if (token) {
                config.headers = config.headers || {}
                config.headers.Authorization = `Bearer ${token}`
            }

            return config
        },
        (error) => Promise.reject(error)
    )

    api.interceptors.response.use(
        (response) => response,
        async (error: AxiosError) => {
            const originalRequest = error.config as AxiosRequestConfig

            // Skip handling for public endpoints
            if (publicEndpoints.some(endpoint => originalRequest.url?.startsWith(endpoint))) {
                return Promise.reject(error)
            }

            // Handle 401 Unauthorized errors
            if (error.response?.status === 401) {
                // Clear the invalid token
                useCookie('token').value = null

                // Redirect to login page (client-side only)
                if (process.client) {
                    navigateTo('/user-login')
                }
            }

            return Promise.reject(error)
        }
    )

    return api
}

export function useApi() {
    return createApi()
}