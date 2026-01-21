import { getRefreshToken, setAccessToken } from './apiClient'
import { refresh, me, logout } from '@/src/services/authService'

export const bootstrapAuth = async () => {
  try {
    const refreshToken = await getRefreshToken()
    if (!refreshToken) return null

    const accessToken = await refresh(refreshToken)
    setAccessToken(accessToken)

    const user = await me()
    return user
  } catch (err) {
    await logout()
    return null
  }
}
