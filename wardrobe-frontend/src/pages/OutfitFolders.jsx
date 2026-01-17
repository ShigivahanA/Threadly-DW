import { useEffect, useState } from 'react'
import outfitService from '../services/outfitService'
import OutfitFolderCard from '../components/outfit/OutfitFolderCard'
import OutfitFolderSkeletonGrid from '../components/outfit/OutfitFolderSkeletonGrid'


const OutfitFolders = () => {
  const [outfits, setOutfits] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    outfitService.getOutfits()
      .then(setOutfits)
      .finally(() => setLoading(false))
  }, [])

if (loading) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 space-y-6">
      <div className="flex items-end justify-between">
        <div className="h-7 w-40 rounded bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
        <div className="h-4 w-20 rounded bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
      </div>

      <OutfitFolderSkeletonGrid />
    </div>
  )
}


  if (outfits.length === 0) {
    return (
      <div className="py-20 text-center text-sm text-neutral-500 dark:text-neutral-500">
        No outfits saved yet
      </div>
    )
  }

  return (
  <div className="mx-auto max-w-6xl px-4 py-10 space-y-6">
    <div className="flex items-end justify-between">
      <h1 className="text-2xl font-semibold dark:text-neutral-500">
        Saved Outfits
      </h1>

      <p className="text-sm text-neutral-500">
        {outfits.length} outfit{outfits.length !== 1 ? 's' : ''}
      </p>
    </div>

    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {outfits.map(outfit => (
        <OutfitFolderCard key={outfit._id} outfit={outfit} />
      ))}
    </div>
  </div>
)

}

export default OutfitFolders
