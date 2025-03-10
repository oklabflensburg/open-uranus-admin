import { useAuth } from '@/composables/useAuth'

export const useApi = () => {
  const { accessToken, refreshAccessToken } = useAuth()

  const fetchApi = async (url, options = {}) => {
    if (!accessToken.value) {
      const refreshed = await refreshAccessToken()

      if (!refreshed) throw new Error('Not authenticated')
    }

    return await $fetch(url, {
      ...options,
      headers: {
        Authorization: `Bearer ${accessToken.value}`,
        ...options.headers
      }
    })
  }

  return { fetchApi }
}