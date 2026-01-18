const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

// In-memory access token
let accessToken = null

// 🔒 Prevent parallel refresh calls
let isRefreshing = false
let refreshPromise = null

/* ======================
   Token helpers
====================== */

export const setAccessToken = (token) => {
  accessToken = token
}

export const getAccessToken = () => accessToken


export const clearAccessToken = () => {
  accessToken = null
}

const getRefreshToken = () => {
  return localStorage.getItem('refresh_token')
}

const setRefreshToken = (token) => {
  localStorage.setItem('refresh_token', token)
}

const clearRefreshToken = () => {
  localStorage.removeItem('refresh_token')
}

/* ======================
   Core request handler
====================== */

const request = async (url, options = {}, retry = true) => {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  }

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`
  }

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    credentials: 'include',
    headers
  })

  // Success
  if (response.ok) {
    const data = await response.json()
    return data
  }

  // // Unauthorized → try refresh once
  // if (response.status === 401 && retry) {
  //   const refreshed = await refreshAccessToken()
  //   if (refreshed) {
  //     return request(url, options, false)
  //   }
  // }

  // Other errors
  const errorData = await response.json().catch(() => ({}))
  const message = errorData.message || 'Request failed'

  throw new Error(message)
}

/* ======================
   Refresh token flow
====================== */

// const refreshAccessToken = async () => {
//   if (isRefreshing) {
//     return refreshPromise
//   }

//   const refreshToken = getRefreshToken()
//   if (!refreshToken) {
//     forceLogout()
//     return false
//   }

//   isRefreshing = true

//   refreshPromise = (async () => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ refreshToken })
//       })

//       if (!response.ok) {
//         throw new Error('Refresh failed')
//       }

//       const json = await response.json()
//       const payload = json.data || json

//       if (!payload.accessToken || !payload.refreshToken) {
//         throw new Error('Invalid refresh payload')
//       }

//       setAccessToken(payload.accessToken)
//       setRefreshToken(payload.refreshToken)

//       return true
//     } catch {
//       forceLogout()
//       return false
//     } finally {
//       isRefreshing = false
//       refreshPromise = null
//     }
//   })()

//   return refreshPromise
// }

/* ======================
   Logout helper
====================== */

export const forceLogout = () => {
  clearAccessToken()
  clearRefreshToken()
}

/* ======================
   Public API methods
====================== */
const apiClient = {
  get: (url) => request(url, { method: 'GET' }),

  post: (url, body) =>
    request(url, {
      method: 'POST',
      body: JSON.stringify(body)
    }),

  patch: (url, body) =>
    request(url, {
      method: 'PATCH',
      body: JSON.stringify(body)
    }),

  put: (url, body) =>
    request(url, {
      method: 'PUT',
      body: JSON.stringify(body)
    }),

  delete: (url) =>
    request(url, {
      method: 'DELETE'
    })
}

export default apiClient

