import apiClient from './apiClient'

const getProfile = async () => {
  const res = await apiClient.get('/profile')
  return res.data
}

const updateProfile = async (payload) => {
  const res = await apiClient.patch('/profile', payload)
  return res.data
}

const exportData = async () => {
  await apiClient.post('/profile/export')
}

const deleteAccount = async () => {
  await apiClient.delete('/profile')
}

const terminateSession = async (sessionId) => {
  await apiClient.delete(`/profile/sessions/${sessionId}`)
}


export default {
  getProfile,
  updateProfile,
  exportData,
  deleteAccount,
  terminateSession,
}
