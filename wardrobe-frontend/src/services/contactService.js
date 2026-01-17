import apiClient from './apiClient'

const sendMessage = async (payload) => {
  const res = await apiClient.post('/contact', payload)
  return res.data
}

export default {
  sendMessage
}
