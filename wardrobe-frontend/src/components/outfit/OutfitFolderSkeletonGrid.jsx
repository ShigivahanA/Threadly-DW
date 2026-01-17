import OutfitFolderSkeleton from './OutfitFolderSkeleton'

const OutfitFolderSkeletonGrid = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <OutfitFolderSkeleton key={i} />
      ))}
    </div>
  )
}

export default OutfitFolderSkeletonGrid
