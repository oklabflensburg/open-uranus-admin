import { useAuth } from '~/composables/useAuth'

export default defineNuxtRouteMiddleware((to) => {
  const { accessToken } = useAuth()
  const publicPages = ['/signin', '/signup']

  if (!accessToken.value && !publicPages.includes(to.path)) {
    return navigateTo('/signin')
  }
})
