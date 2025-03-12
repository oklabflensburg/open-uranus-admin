import { useCookie } from '#app'

export const useAuth = () => {
  const accessToken = useCookie('access_token', { maxAge: 3600, httpOnly: false })
  const refreshToken = useCookie('refresh_token', { maxAge: 3600, httpOnly: false })

  const login = async (email, password) => {
    const url = 'https://api.uranus.oklabflensburg.de/user/signin'

    const formData = new URLSearchParams()

    formData.append('grant_type', 'password')
    formData.append('username', email)
    formData.append('password', password)
    formData.append('scope', '')
    formData.append('client_id', 'string') // Remove if not needed
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
        return true
      }
    } catch (error) {
      console.error('Login failed:', error)
      return false
    }
  }

  const signup = async (signupData) => {
    const url = 'https://api.uranus.oklabflensburg.de/user/signup'

    const body = {
      first_name: signupData.firstName,
      last_name: signupData.lastName,
      username: signupData.username,
      email_address: signupData.emailAddress,
      password: signupData.password,
      i18n_locale_id: signupData.i18nLocaleId,
      phone_number: signupData.phoneNumber
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
        return true
      }
    } catch (error) {
      console.error('Signup failed:', error)
      return false
    }
  }

  const refreshAccessToken = async () => {
    const url = 'https://api.uranus.oklabflensburg.de/user/token/refresh'

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
        return true
      }
    } catch (error) {
      console.error('Token refresh failed:', error)
      logout()
      return false
    }
  }

  const logout = () => {
    accessToken.value = null
    refreshToken.value = null
  }

  return { accessToken, refreshToken, login, signup, refreshAccessToken, logout }
}