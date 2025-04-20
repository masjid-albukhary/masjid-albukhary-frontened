// export default defineNuxtRouteMiddleware((to, from) => {
//     const token = useCookie('token');
//     const refresh = useCookie('refresh_token');
//     const isAuthenticated = token.value && refresh.value;
//
//     if (!isAuthenticated && to.path !== '/user-login') {
//         return navigateTo('/user-login');
//     }
//
//     if (isAuthenticated && to.path === '/user-login') {
//         return navigateTo('/admin');
//     }
// });


export default defineNuxtRouteMiddleware((to, from) => {
    const token = useCookie('token');

    // Public routes that don't need authentication
    const publicRoutes = ['/user-login', '/', '/about', '/contact'];

    // If no token and trying to access protected route, redirect to login
    if (!token.value && !publicRoutes.includes(to.path)) {
        return navigateTo('/user-login');
    }

    // If has token but trying to access login page, redirect to admin
    if (token.value && to.path === '/user-login') {
        return navigateTo('/admin');
    }
});