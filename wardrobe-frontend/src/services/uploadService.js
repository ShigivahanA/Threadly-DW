import apiClient from './apiClient'

const getUploadSignature = async () => {
  const res = await apiClient.post('/uploads/signature')

  // apiClient already returns parsed JSON
  // { status, message, data }
  return res.data
}

const uploadToCloudinary = async (file, signature) => {
  if (!signature?.apiKey) {
    throw new Error('Invalid upload signature')
  }

  const formData = new FormData()

  formData.append('file', file)
  formData.append('api_key', signature.apiKey)
  formData.append('timestamp', signature.timestamp)
  formData.append('signature', signature.signature)
  formData.append('folder', signature.uploadParams.folder)
  formData.append(
    'transformation',
    signature.uploadParams.transformation
  )

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${signature.cloudName}/image/upload`,
    {
      method: 'POST',
      body: formData
    }
  )

  if (!res.ok) {
    throw new Error('Image upload failed')
  }

  return res.json()
}

const uploadService = {
  getUploadSignature,
  uploadToCloudinary
}

export default uploadService
