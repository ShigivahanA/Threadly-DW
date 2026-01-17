import { useNavigate } from 'react-router-dom'

const OutfitFolderCard = ({ outfit }) => {
  const navigate = useNavigate()

  const { top, bottom, footwear } = outfit.items

  return (
    <button
      onClick={() => navigate(`/outfits/${outfit._id}`)}
      className="
        group
        rounded-2xl
        border border-neutral-200 dark:border-neutral-800
        bg-white dark:bg-neutral-900
        p-3
        text-left
        transition-all
        hover:-translate-y-0.5
        hover:shadow-lg
        active:scale-[0.98]
      "
    >
      {/* Outfit preview */}
      <div className="grid grid-cols-3 gap-1 rounded-xl overflow-hidden">
        {[top, bottom, footwear].map((item) => (
          <img
            key={item._id}
            src={item.imageUrl}
            alt={item.category}
            className="aspect-square object-cover"
          />
        ))}
      </div>

      {/* Meta */}
      <div className="mt-3 space-y-1">
        <p className="text-xs text-neutral-500 truncate">
          {outfit.occasion || 'No occasion'}
        </p>

        <p className="text-[11px] text-neutral-400">
          Worn {outfit.wearCount} time{outfit.wearCount !== 1 ? 's' : ''}
        </p>
      </div>
    </button>
  )
}

export default OutfitFolderCard
