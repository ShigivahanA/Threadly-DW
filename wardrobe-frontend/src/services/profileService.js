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

const requestPasswordOtp = async () => {
  await apiClient.post('/profile/password/otp')
}

const changePassword = async ({ currentPassword, newPassword, otp }) => {
  await apiClient.post('/profile/password/change', {
    currentPassword,
    newPassword,
    otp
  })
}




export default {
  getProfile,
  updateProfile,
  exportData,
  deleteAccount,
  terminateSession,
  requestPasswordOtp,
  changePassword
}
