export default defineNuxtRouteMiddleware((to, from) => {
    const event = useRequestEvent(); // works in middleware

    const token = getCookie(event, 'token');
    const refresh = getCookie(event, 'refresh_token');

    const isAuthenticated = !!token && !!refresh;

    if (!isAuthenticated && to.path !== '/user-login') {
        return navigateTo('/user-login');
    }

    if (isAuthenticated && to.path === '/user-login') {
        return navigateTo('/admin');
    }
});
