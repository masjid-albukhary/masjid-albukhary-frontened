export default defineNuxtRouteMiddleware((to, from) => {
    const token = useCookie('token');
    const refresh = useCookie('refresh_token');

    const bothThere = token.value && refresh.value;

    if (!bothThere && to.path !== '/login') {
        return navigateTo('/user-login');
    }

    if (token.value && to.path === '/login') {
        return navigateTo('/admin');
    }
});