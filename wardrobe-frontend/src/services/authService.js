import apiClient, { setAccessToken, forceLogout } from './apiClient'

/* ======================
   Helpers
====================== */

const normalizeUser = (user) => ({
  id: user.id || user._id,
  email: user.email,
  name: user.name || ''
})

const extractPayload = (res) => res.data?.data ?? res.data

const storeSession = ({ accessToken, refreshToken }) => {
  if (!accessToken || !refreshToken) {
    throw new Error('Invalid session payload')
  }

  setAccessToken(accessToken)
  localStorage.setItem('refresh_token', refreshToken)
}

/* ======================
   Auth APIs
====================== */

const register = async (payload) => {
  const res = await apiClient.post('/auth/register', payload)
  const data = extractPayload(res)

  storeSession(data)

  return {
    user: normalizeUser(data.user)
  }
}

const login = async (payload) => {
  const res = await apiClient.post('/auth/login', payload)
  const data = extractPayload(res)

  storeSession(data)

  return {
    user: normalizeUser(data.user)
  }
}

const requestOtp = async (email) => {
  await apiClient.post('/auth/otp/request', { email })
}

const verifyOtp = async ({ email, otp }) => {
  const res = await apiClient.post('/auth/otp/verify', { email, otp })
  const data = extractPayload(res)

  storeSession(data)

  return {
    user: normalizeUser(data.user)
  }
}

/**
 * 🔑 CRITICAL FIX
 * Refresh now restores tokens atomically
 */
const refresh = async () => {
  const refreshToken = localStorage.getItem('refresh_token')
  if (!refreshToken) {
    throw new Error('No refresh token')
  }

  const res = await apiClient.post('/auth/refresh', { refreshToken })
  const data = extractPayload(res)

  // ❌ DO NOT overwrite refresh token (backend doesn’t send it)
  setAccessToken(data.accessToken)

  return {
    accessToken: data.accessToken
  }
}


const me = async () => {
  const res = await apiClient.get('/auth/me')
  const data = extractPayload(res)

  return {
    user: normalizeUser(data.user)
  }
}

const logout = async () => {
  try {
    await apiClient.post('/auth/logout')
  } finally {
    forceLogout()
    localStorage.removeItem('refresh_token')
  }
}

const forgotPassword = async (email) => {
  if (!email) {
    throw new Error('Email is required')
  }

  await apiClient.post('/auth/password/forgot', { email })
}

const resetPassword = async ({ token, password }) => {
  if (!token || !password) {
    throw new Error('Token and password are required')
  }

  await apiClient.post('/auth/password/reset', {
    token,
    newPassword: password
  })
}


export default {
  register,
  login,
  logout,
  refresh,
  me,
  requestOtp,
  verifyOtp,
  forgotPassword,
  resetPassword,
}
