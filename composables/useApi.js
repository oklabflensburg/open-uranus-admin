import { useAuth } from '@/composables/useAuth'
import { useRuntimeConfig } from '#app'
import { useRouter } from 'vue-router'

export const useApi = () => {
  const { accessToken, refreshAccessToken, logout } = useAuth()
  const config = useRuntimeConfig()
  const API_BASE_URL = config.public.apiBaseUrl
  const router = useRouter()

  const fetchApi = async (endpoint, options = {}) => {
    if (!accessToken.value) {
      const refreshed = await refreshAccessToken()

      if (!refreshed) {
        logout()
        throw new Error('Not authenticated')
      }
    }

    try {
      return await $fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          Authorization: `Bearer ${accessToken.value}`,
          ...options.headers
        }
      })
    } catch (error) {
      if (error.response && error.response.status === 401) {
        const refreshed = await refreshAccessToken()

        if (!refreshed) {
          logout()
          throw new Error('Not authenticated')
        }

        return await $fetch(`${API_BASE_URL}${endpoint}`, {
          ...options,
          headers: {
            Authorization: `Bearer ${accessToken.value}`,
            ...options.headers
          }
        })
      } else {
        // Handle uncaught errors during route navigation
        if (error.message.includes('uncaught error during route navigation')) {
          router.push('/error') // Redirect to error page
        }
        throw error
      }
    }
  }

  return { fetchApi }
}