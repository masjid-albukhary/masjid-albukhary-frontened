export default defineNuxtRouteMiddleware((to, from) => {
    const token = useCookie('token', {sameSite: 'lax'});
    const refresh = useCookie('refresh_token', {sameSite: 'lax'});

    const isAuthenticated = !!token.value && !!refresh.value;

    if (!isAuthenticated && to.path !== '/user-login') {
        return navigateTo('/user-login');
    }

    if (isAuthenticated && to.path === '/user-login') {
        return navigateTo('/admin');
    }
});
