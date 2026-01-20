import { request } from './apiClient'

type ContactPayload = {
  name?: string
  email: string
  message: string
}

const sendMessage = async (payload: ContactPayload) => {
  const res = await request('/contact', {
    method: 'POST',
    body: JSON.stringify(payload),
  })

  return res?.data ?? res
}

export default {
  sendMessage,
}
