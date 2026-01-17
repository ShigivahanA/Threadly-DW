import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import wardrobeService from '../services/wardrobeService'
import MetadataForm from '../components/upload/MetadataForm'
import UploadActions from '../components/upload/UploadActions'
import WardrobeItemSkeleton from '../components/wardrobe/WardrobeItemSkeleton'

const WardrobeItem = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    const loadItem = async () => {
      try {
        const data = await wardrobeService.getItemById(id)
        if (mounted) setItem(data)
      } catch {
        if (mounted) setItem(null)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    loadItem()

    return () => {
      mounted = false
    }
  }, [id])

  /* ======================
     Loading state
  ====================== */
  if (loading) {
    return <WardrobeItemSkeleton />
  }

  if (!item) {
    return (
      <div className="mx-auto max-w-lg px-4 py-12 text-center text-sm text-neutral-500">
        Item not found
      </div>
    )
  }

  const handleSave = async () => {
    await wardrobeService.updateItem(id, item)
    navigate('/wardrobe')
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-6 space-y-6">
      {/* Image */}
      <div className="rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-700">
        <img
          src={item.imageUrl}
          alt={item.category}
          className="w-full object-cover"
        />
      </div>

      {/* Metadata */}
      <MetadataForm
        meta={item}
        setMeta={setItem}
        imageSrc={item.imageUrl}
      />

      {/* Actions */}
      <UploadActions
        primaryText="Save changes"
        secondaryText="Back"
        onPrimary={handleSave}
        onSecondary={() => navigate(-1)}
      />
    </div>
  )
}

export default WardrobeItem
