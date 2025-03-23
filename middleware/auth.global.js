import { useLocalePath } from '#imports'

export default defineNuxtRouteMiddleware(async (to) => {
  const { accessToken, refreshAccessToken, logout } = useAuth()
  const localePath = useLocalePath()

  // If auth is explicitly set to false, do nothing (allow public access)
  if (to.meta.auth === false) {
    return
  }

  // Enforce authentication for protected pages
  if (!accessToken.value) {
    const refreshed = await refreshAccessToken()
    if (!refreshed) {
      logout()
      return navigateTo(localePath('/signin'))
    }
  }
})
