export default defineNuxtRouteMiddleware(async (to, from) => {
    const tokenCookie = useCookie('token');
    const refreshCookie = useCookie('refresh_token');

    // Check if we have tokens
    if (tokenCookie.value && refreshCookie.value) {
        // If trying to access login page, redirect to admin
        if (to.path === '/user-login') {
            return navigateTo('/admin');
        }
        return; // Allow access
    }

    // No tokens - check localStorage as fallback
    if (process.client) {
        const lsToken = localStorage.getItem('token');
        const lsRefresh = localStorage.getItem('refresh_token');

        if (lsToken && lsRefresh) {
            tokenCookie.value = lsToken;
            refreshCookie.value = lsRefresh;

            if (to.path === '/user-login') {
                return navigateTo('/admin');
            }
            return;
        }
    }

    // No valid tokens found - redirect to login (except for login page)
    if (to.path !== '/user-login') {
        return navigateTo('/user-login');
    }
});