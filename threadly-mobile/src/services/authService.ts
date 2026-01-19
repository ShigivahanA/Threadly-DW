import {
  request,
  setAccessToken,
  setRefreshToken,
  clearAccessToken,
  clearRefreshToken,
} from './apiClient'

/* ======================
   Types
====================== */

export interface LoginPayload {
  email: string
  password: string
}

export interface OtpVerifyPayload {
  email: string
  otp: string
}

/* ======================
   Helpers
====================== */

const extractData = (res: any) => {
  // backend sometimes wraps response
  return res?.data ?? res
}

const storeSession = async (data: any) => {
  if (!data?.accessToken || !data?.refreshToken) {
    throw new Error('Invalid auth response')
  }

  setAccessToken(data.accessToken)
  await setRefreshToken(data.refreshToken)

  return data.user
}

/* ======================
   Password Login
====================== */

export const login = async ({
  email,
  password,
}: LoginPayload) => {
  const res = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })

  const data = extractData(res)
  return storeSession(data)
}

/* ======================
   OTP Request
====================== */

export const requestOtp = async (email: string) => {
  if (!email) {
    throw new Error('Email is required')
  }

  await request('/auth/otp/request', {
    method: 'POST',
    body: JSON.stringify({ email }),
  })
}

/* ======================
   OTP Verify (Login)
====================== */

export const verifyOtp = async ({
  email,
  otp,
}: OtpVerifyPayload) => {
  if (!email || !otp) {
    throw new Error('Email and OTP are required')
  }

  const res = await request('/auth/otp/verify', {
    method: 'POST',
    body: JSON.stringify({ email, otp }),
  })

  const data = extractData(res)
  return storeSession(data)
}

/* ======================
   Current User
====================== */

export const me = async () => {
  const res = await request('/auth/me', {
    method: 'GET',
  })

  const data = extractData(res)

  if (!data?.user) {
    throw new Error('Invalid session')
  }

  return data.user
}

/* ======================
   Refresh Session
====================== */

export const refresh = async (refreshToken: string) => {
  if (!refreshToken) {
    throw new Error('No refresh token')
  }

  const res = await request('/auth/refresh', {
    method: 'POST',
    body: JSON.stringify({ refreshToken }),
  })

  const data = extractData(res)

  if (!data?.accessToken) {
    throw new Error('Invalid refresh response')
  }

  setAccessToken(data.accessToken)
  return data.accessToken
}

/* ======================
   Logout
====================== */

export const logout = async () => {
  try {
    await request('/auth/logout', {
      method: 'POST',
    })
  } finally {
    clearAccessToken()
    await clearRefreshToken()
  }
}


/* ======================
   Forgot Password
====================== */

export const requestPasswordReset = async (email: string) => {
  if (!email) {
    throw new Error('Email is required')
  }

  await request('/auth/password/forgot', {
    method: 'POST',
    body: JSON.stringify({ email }),
  })
}

/* ======================
   Register
====================== */

export interface RegisterPayload {
  name: string
  email: string
  password: string
}

export const register = async ({
  name,
  email,
  password,
}: RegisterPayload) => {
  if (!name || !email || !password) {
    throw new Error('All fields are required')
  }

  const res = await request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  })

  const data = extractData(res)
  return storeSession(data)
}
