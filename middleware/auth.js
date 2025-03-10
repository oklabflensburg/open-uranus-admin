export default defineNuxtRouteMiddleware((to, from) => {
  const { accessToken } = useAuth()

  if (!accessToken.value && to.path !== '/signin') {
    return navigateTo('/signin') // Redirect if not authenticated
  }
})
