export default defineNuxtRouteMiddleware((to, from) => {
    const token = useCookie('token');
    const refresh = useCookie('refresh_token');
    const isAuthenticated = token.value && refresh.value;

    if (!isAuthenticated && to.path !== '/user-login') {
        return navigateTo('/user-login');
    }

    if (isAuthenticated && to.path === '/user-login') {
        return navigateTo('/admin');
    }
});