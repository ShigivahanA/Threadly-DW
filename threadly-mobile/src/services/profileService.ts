import { request } from './apiClient'

export const getProfile = async () => {
  const res = await request('/profile', { method: 'GET' })
  return res.data ?? res
}

export const updateProfile = async (payload: { name: string }) => {
  await request('/profile', {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
}

export const exportData = async () => {
  await request('/profile/export', { method: 'POST' })
}

export const deleteAccount = async () => {
  await request('/profile', { method: 'DELETE' })
}

export const terminateSession = async (sessionId: string) => {
  await request(`/profile/sessions/${sessionId}`, {
    method: 'DELETE',
  })
}

export default {
  getProfile,
  updateProfile,
  exportData,
  deleteAccount,
  terminateSession,
}
