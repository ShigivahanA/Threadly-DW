import { useState } from 'react'
import UploadDropzone from '../components/upload/UploadDropzone'
import ImagePreview from '../components/upload/ImagePreview'
import UploadProgress from '../components/upload/UploadProgress'
import MetadataForm from '../components/upload/MetadataForm'
import UploadActions from '../components/upload/UploadActions'

import uploadService from '../services/uploadService'
import wardrobeService from '../services/wardrobeService'
import useToast from '../hooks/useToast'

const Upload = () => {
  const { showToast } = useToast()

  const [file, setFile] = useState(null)
  const [localPreview, setLocalPreview] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [uploadedImage, setUploadedImage] = useState(null)

  const [meta, setMeta] = useState({
    category: '',
    size: '',
    colors: [],
    brand: '',
    occasion: 'other',
    season: 'all',
    isFavorite: false,
    tags: [],
    notes: ''
  })

  const handleFileSelect = (file) => {
    setFile(file)
    setLocalPreview(URL.createObjectURL(file))
    setUploadedImage(null)
  }

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    try {
      const signature = await uploadService.getUploadSignature()
      const result = await uploadService.uploadToCloudinary(file, signature)

      setUploadedImage({
        url: result.secure_url,
        publicId: result.public_id
      })

      showToast('Image uploaded successfully', 'success')
    } catch (err) {
      showToast(err.message || 'Upload failed', 'error')
    } finally {
      setUploading(false)
    }
  }

  const handleSave = async () => {
    if (!uploadedImage || !meta.category) {
      showToast('Please complete required fields', 'error')
      return
    }

    try {
      await wardrobeService.addItem({
        imageUrl: uploadedImage.url,
        imagePublicId: uploadedImage.publicId,
        ...meta
      })

      showToast('Item added to wardrobe', 'success')
      resetPage()
    } catch {
      showToast('Failed to save item', 'error')
    }
  }

  const resetPage = () => {
    setFile(null)
    setLocalPreview(null)
    setUploadedImage(null)
    setMeta({
      category: '',
      size: '',
      colors: [],
      brand: '',
      occasion: 'other',
      season: 'all',
      isFavorite: false,
      tags: [],
      notes: ''
    })
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="space-y-6">

        {/* Page header */}
        <div className="space-y-1">
          <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
            Add to wardrobe
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Upload and describe your clothing item
          </p>
        </div>

        {/* Upload card */}
        <div className="rounded-2xl border bg-white dark:bg-neutral-900 dark:border-neutral-800 p-4 space-y-4 shadow-sm">
          <UploadDropzone file={file}
            onSelect={handleFileSelect}
            onRemove={resetPage} />

          {localPreview && (
            <ImagePreview
              src={uploadedImage?.url || localPreview}
              uploaded={Boolean(uploadedImage)}
            />
          )}

          {uploading && <UploadProgress />}

          {localPreview && !uploadedImage && (
            <UploadActions
              primaryText="Upload image"
              onPrimary={handleUpload}
              loading={uploading}
            />
          )}
        </div>

        {/* Metadata card */}
        {uploadedImage && (
          <div className="rounded-2xl border bg-white dark:bg-neutral-900 dark:border-neutral-800 p-4 space-y-5 shadow-sm">
            <div>
              <h2 className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Item details
              </h2>
            </div>

            <MetadataForm
              meta={meta}
              setMeta={setMeta}
              imageSrc={uploadedImage.url}
            />

            <UploadActions
              primaryText="Save to wardrobe"
              secondaryText=""
              onPrimary={handleSave}
              onSecondary={resetPage}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default Upload
