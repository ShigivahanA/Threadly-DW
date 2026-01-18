import { createContext, useContext, useEffect, useState } from 'react'
import authService from '../services/authService'
import { setAccessToken,getAccessToken } from '../services/apiClient'
import AppLoader from '../components/ui/AppLoader'
import {jwtDecode} from 'jwt-decode'

const AuthContext = createContext(null)

/* ======================
   Provider
====================== */

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [sessionId, setSessionId] = useState(null)
  const [loading, setLoading] = useState(true)

  const isAuthenticated = Boolean(user)

  /* ======================
     Bootstrap session
     (CRITICAL – runs once)
  ====================== */

  useEffect(() => {
    let mounted = true

    const bootstrapAuth = async () => {
      try {
        /**
         * STEP 1: Attempt refresh
         * - This ONLY refreshes tokens
         * - It MUST NOT expect user data
         */
        await authService.refresh()
        const accessToken = getAccessToken()
if (accessToken) {
  const decoded = jwtDecode(accessToken)
  setSessionId(decoded.sid)
}

        /**
         * STEP 2: Fetch authenticated user
         * - Requires Authorization header
         * - If this fails → session is invalid
         */
        const { user } = await authService.me()

        if (mounted) {
          setUser(user)
        }
      } catch (err) {
        /**
         * IMPORTANT:
         * - Do NOT force logout
         * - User may simply be unauthenticated
         */
        if (mounted) {
          setUser(null)
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    bootstrapAuth()

    return () => {
      mounted = false
    }
  }, [])

  /* ======================
     Auth actions
  ====================== */

  // Email + password login
  const login = async (credentials) => {
    const { user } = await authService.login(credentials)
    setUser(user)

const accessToken = getAccessToken()
if (accessToken) {
  const decoded = jwtDecode(accessToken)
  setSessionId(decoded.sid)
}

    return user
  }

  // Registration
  const register = async (payload) => {
    const { user } = await authService.register(payload)
    setUser(user)

const accessToken = getAccessToken()
if (accessToken) {
  const decoded = jwtDecode(accessToken)
  setSessionId(decoded.sid)
}

    return user
  }

  // OTP request
  const requestOtp = async (email) => {
    await authService.requestOtp(email)
  }

  // OTP verification login
  const verifyOtpLogin = async ({ email, otp }) => {
    const { user } = await authService.verifyOtp({ email, otp })
    setUser(user)

const accessToken = getAccessToken()
if (accessToken) {
  const decoded = jwtDecode(accessToken)
  setSessionId(decoded.sid)
}

    return user
  }

  // Forgot password
  const forgotPassword = async (email) => {
    await authService.forgotPassword(email)
  }

  // Reset password → force logout
const resetPassword = async ({ token, password }) => {
  await authService.resetPassword({ token, password })

  // Silent local cleanup (NO API calls)
  setUser(null)
  setSessionId(null)
  setAccessToken(null)
  localStorage.removeItem('refresh_token')
}


  /**
   * Manual refresh (optional)
   * - Used if token expires mid-session
   */
  const refreshSession = async () => {
    await authService.refresh()
    const { user } = await authService.me()
    setUser(user)

const accessToken = getAccessToken()
if (accessToken) {
  const decoded = jwtDecode(accessToken)
  setSessionId(decoded.sid)
}

    return user
  }

  // Logout
const logout = async () => {
  try {
    await authService.logout()
  } finally {
    setUser(null)
    setSessionId(null)
    setAccessToken(null)
    localStorage.removeItem('refresh_token')
  }
}

const requestPasswordOtp = async () => {
  await profileService.requestPasswordOtp()
}

const changePassword = async (payload) => {
  await profileService.changePassword(payload)
  await logout()
}



   if (loading) {
    return <AppLoader />
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        currentSessionId: sessionId,
        login,
        register,
        logout,

        requestOtp,
        verifyOtpLogin,

        forgotPassword,
        resetPassword,

        refreshSession,
        requestPasswordOtp,
        changePassword
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

/* ======================
   Hook
====================== */

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return ctx
}
