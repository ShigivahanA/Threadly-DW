import { request } from './apiClient'

export const getUploadSignature = async () => {
  const res = await request('/uploads/signature', {
    method: 'POST',
  })
  return res.data
}

export const uploadToCloudinary = async (
  uri: string,
  signature: any
) => {
  const formData = new FormData()

  formData.append('file', {
    uri,
    type: 'image/jpeg',
    name: 'upload.jpg',
  } as any)

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
      body: formData,
    }
  )

  if (!res.ok) {
    throw new Error('Image upload failed')
  }

  return res.json()
}
