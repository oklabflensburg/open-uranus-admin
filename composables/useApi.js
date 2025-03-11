import { useAuth } from '@/composables/useAuth'

export const useApi = () => {
  const { accessToken, refreshAccessToken, logout } = useAuth()

  const fetchApi = async (url, options = {}) => {
    if (!accessToken.value) {
      const refreshed = await refreshAccessToken()

      if (!refreshed) {
        logout()
        throw new Error('Not authenticated')
      }
    }

    try {
      return await $fetch(url, {
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

        return await $fetch(url, {
          ...options,
          headers: {
            Authorization: `Bearer ${accessToken.value}`,
            ...options.headers
          }
        })
      } else {
        throw error
      }
    }
  }

  return { fetchApi }
}