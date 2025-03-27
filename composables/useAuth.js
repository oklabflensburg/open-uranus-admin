import { useCookie, useRuntimeConfig } from '#app'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

export const useAuth = () => {
  const accessToken = useCookie('access_token', { maxAge: 3600, httpOnly: false })
  const refreshToken = useCookie('refresh_token', { maxAge: 3600, httpOnly: false })
  const userId = useCookie('user_id', { maxAge: 3600, httpOnly: false })
  const userDisplayName = useCookie('user_display_name', { maxAge: 3600, httpOnly: false })
  const config = useRuntimeConfig()
  const apiBaseUrl = config.public.apiBaseUrl
  const router = useRouter()

  const isAuthenticated = computed(() => !!accessToken.value)

  // Function to decode JWT and extract payload
  const decodeJwtAndStoreUserInfo = (token) => {
    try {
      const tokenParts = token.split('.')
      if (tokenParts.length >= 2) {
        // Base64Url decode the payload part
        const base64Url = tokenParts[1].replace(/-/g, '+').replace(/_/g, '/')
        const base64 = base64Url.padEnd(base64Url.length + (4 - base64Url.length % 4) % 4, '=')
        const payload = JSON.parse(atob(base64))
        
        // Store user information in cookies
        if (payload.user_id) {
          userId.value = payload.user_id
        }
        if (payload.user_display_name) {
          userDisplayName.value = payload.user_display_name
        }
      }
    } catch (error) {
      console.error('Error decoding JWT token:', error)
    }
  }

  const redirectToSignInIfNotAuthenticated = () => {
    if (!isAuthenticated.value) {
      router.push('/signin')
    }
  }

  const login = async (email, password) => {
    const url = `${apiBaseUrl}/user/signin`
    const formData = new URLSearchParams()

    formData.append('grant_type', 'password')
    formData.append('username', email)
    formData.append('password', password)
    formData.append('scope', '')
    formData.append('client_id', 'string')
    formData.append('client_secret', 'string')

    try {
      const response = await $fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData
      })

      if (response.access_token) {
        accessToken.value = response.access_token
        refreshToken.value = response.refresh_token
        // Decode JWT and store user info in cookies
        decodeJwtAndStoreUserInfo(response.access_token)
        return true
      } else {
        return response.detail
      }
    } catch (error) {
      return error.data.detail
    }
  }

  const signup = async (signupData) => {
    const url = `${apiBaseUrl}/user/signup`

    const body = {
      username: signupData.username,
      password: signupData.password
    }

    try {
      const response = await $fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      if (response.access_token) {
        accessToken.value = response.access_token
        refreshToken.value = response.refresh_token
        // Decode JWT and store user info in cookies
        decodeJwtAndStoreUserInfo(response.access_token)
        return true
      } else {
        return response.detail || 'Signup failed'
      }
    } catch (error) {
      return error.data.detail || 'Signup failed'
    }
  }

  const refreshAccessToken = async () => {
    const url = `${apiBaseUrl}/user/token/refresh`
    console.log('Refresh Token URL:', url) // Debugging line

    const body = {
      grant_type: 'refresh_token',
      refresh_token: refreshToken.value,
      client_id: 'string', // Remove if not needed
      client_secret: 'string'
    }

    try {
      const response = await $fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      if (response.access_token) {
        accessToken.value = response.access_token
        refreshToken.value = response.refresh_token
        // Decode JWT and store user info in cookies
        decodeJwtAndStoreUserInfo(response.access_token)
        return true
      }
    } catch (error) {
      console.error('Token refresh failed:', error)
      logout()
      router.push('/signin')
      return false
    }
  }

  const logout = () => {
    accessToken.value = null
    refreshToken.value = null
    userId.value = null
    userDisplayName.value = null
  }

  const handleForgotPassword = async (email) => {
    const url = `${apiBaseUrl}/user/forgot/password`

    try {
      const response = await $fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      if (!response.ok) {
        throw new Error('Failed to send forgot password request')
      }

      return response.detail
    } catch (error) {
      return error.data.detail
    }
  }

  return { 
    accessToken, 
    refreshToken,
    userId,
    userDisplayName,
    login, 
    signup, 
    refreshAccessToken, 
    logout, 
    isAuthenticated, 
    redirectToSignInIfNotAuthenticated,
    handleForgotPassword
  }
}