import { useAuth } from '~/composables/useAuth'

export default defineNuxtRouteMiddleware((to) => {
  const { isAuthenticated } = useAuth()
  const publicPages = ['/signin', '/signup']

  if (!isAuthenticated.value && !publicPages.includes(to.path)) {
    return navigateTo('/signin')
  }
})
