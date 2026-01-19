import * as SecureStore from 'expo-secure-store'

/* ======================
   Config
====================== */

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ||
  'https://threadly-dw-server.vercel.app/api'

/* ======================
   In-memory access token
====================== */

let accessToken: string | null = null

export const setAccessToken = (token: string | null) => {
  accessToken = token
}

export const getAccessToken = () => accessToken

/* ======================
   Refresh token (SecureStore)
====================== */

export const setRefreshToken = async (token: string) => {
  await SecureStore.setItemAsync('refresh_token', token)
}

export const getRefreshToken = async () => {
  return SecureStore.getItemAsync('refresh_token')
}

export const clearRefreshToken = async () => {
  await SecureStore.deleteItemAsync('refresh_token')
}

/* ======================
   Clear helpers (EXPORTED)
====================== */

export const clearAccessToken = () => {
  accessToken = null
}


/* ======================
   Force logout helper
====================== */

export const forceLogout = async () => {
  accessToken = null
  await clearRefreshToken()
}

/* ======================
   Refresh control
====================== */

let isRefreshing = false
let refreshPromise: Promise<string | null> | null = null

const refreshAccessToken = async () => {
  if (isRefreshing && refreshPromise) {
    return refreshPromise
  }

  isRefreshing = true

  refreshPromise = (async () => {
    try {
      const refreshToken = await getRefreshToken()
      if (!refreshToken) throw new Error('No refresh token')

      const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      })

      const json = await res.json().catch(() => ({}))

      if (!res.ok || !json?.data?.accessToken) {
        throw new Error('Refresh failed')
      }

      const newAccessToken = json.data.accessToken
      setAccessToken(newAccessToken)

      return newAccessToken
    } catch {
      await forceLogout()
      return null
    } finally {
      isRefreshing = false
      refreshPromise = null
    }
  })()

  return refreshPromise
}

/* ======================
   Core request
====================== */

export const request = async<T = any> (
  url: string,
  options: RequestInit = {},
  retry = true
): Promise<T> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`
  }

  const res = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  })

  const json = await res.json().catch(() => ({}))

  /* ---------- Success ---------- */
  if (res.ok) {
    return json
  }

  /* ---------- Unauthorized → refresh ---------- */
  if (res.status === 401 && retry) {
    const newToken = await refreshAccessToken()
    if (newToken) {
      return request(url, options, false)
    }
  }

  /* ---------- Other errors ---------- */
  throw new Error(json.message || 'Request failed')
}
