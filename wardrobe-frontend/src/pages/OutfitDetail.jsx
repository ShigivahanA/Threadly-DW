import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import outfitService from '../services/outfitService'
import Spinner from '../components/ui/Spinner'
import OutfitDetailSkeleton from '../components/outfit/OutfitDetailSkeleton'

const OutfitDetail = () => {
  const { id } = useParams()
  const [outfit, setOutfit] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    outfitService.getOutfitById(id)
      .then(setOutfit)
      .finally(() => setLoading(false))
  }, [id])

 if (loading) {
  return <OutfitDetailSkeleton />
}

  if (!outfit) {
    return (
      <div className="py-20 text-center text-sm text-neutral-500 dark:text-neutral-400">
        Outfit not found
      </div>
    )
  }

  const { top, bottom, footwear } = outfit.items

  const markWorn = async () => {
    setUpdating(true)
    try {
      const res = await outfitService.markWorn(id)
      setOutfit(p => ({
        ...p,
        wearCount: res.wearCount,
        lastWornAt: res.lastWornAt
      }))
    } finally {
      setUpdating(false)
    }
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-10 space-y-8">
      <h1 className="text-xl font-semibold text-center dark:text-neutral-500">
        Outfit Details
      </h1>

      {/* Outfit */}
      <div className="grid grid-cols-3 gap-2">
        {[top, bottom, footwear].map(item => (
          <div
            key={item._id}
            className="
              rounded-xl overflow-hidden
              border border-neutral-200 dark:border-neutral-800
            "
          >
            <img
              src={item.imageUrl}
              alt={item.category}
              className="aspect-square object-cover"
            />
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="text-center space-y-1">
        <p className="text-sm text-neutral-500">
          Worn {outfit.wearCount} time{outfit.wearCount !== 1 ? 's' : ''}
        </p>

        {outfit.lastWornAt && (
          <p className="text-xs text-neutral-400">
            Last worn on {new Date(outfit.lastWornAt).toLocaleDateString()}
          </p>
        )}
      </div>

      {/* Action */}
      <button
        disabled={updating}
        onClick={markWorn}
        className="
          w-full rounded-xl py-2.5
          bg-black text-white
          dark:bg-white dark:text-black
          font-medium
          disabled:opacity-50
        "
      >
        {updating ? <Spinner /> : 'Mark as worn today'}
      </button>
    </div>
  )
}

export default OutfitDetail
