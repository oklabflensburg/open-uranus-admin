import { useAuth } from '~/composables/useAuth'

export default defineNuxtRouteMiddleware((to) => {
  const { accessToken, isAuthenticated } = useAuth() // Ensure isAuthenticated is imported
  const publicPages = ['/signin', '/signup']

  if (!isAuthenticated.value && !publicPages.includes(to.path)) { // Use isAuthenticated instead of accessToken
    return navigateTo('/signin')
  }
})
