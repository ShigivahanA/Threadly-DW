import { useState } from 'react'
import uploadService from '../services/uploadService'
import wardrobeService from '../services/wardrobeService'

const useAddItem = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const addItem = async ({
    file,
    category,
    colors = [],
    season = 'all',
    tags = []
  }) => {
    try {
      setLoading(true)
      setError(null)

      // 1. Get upload signature
      const {
        cloudName,
        apiKey,
        signature,
        timestamp,
        uploadParams
      } = await uploadService.getUploadSignature()

      // 2. Upload image to Cloudinary
      const uploadResult = await uploadService.uploadToCloudinary({
        file,
        cloudName,
        apiKey,
        signature,
        timestamp,
        uploadParams
      })

      // 3. Save wardrobe item
      await wardrobeService.addItem({
        imageUrl: uploadResult.secure_url,
        imagePublicId: uploadResult.public_id,
        category,
        colors,
        season,
        tags
      })

      return true
    } catch (err) {
      setError(err.message || 'Failed to add item')
      return false
    } finally {
      setLoading(false)
    }
  }

  return {
    addItem,
    loading,
    error
  }
}

export default useAddItem
