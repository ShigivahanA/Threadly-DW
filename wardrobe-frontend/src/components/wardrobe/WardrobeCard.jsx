import { Heart } from 'lucide-react'

const WardrobeCard = ({ item, onToggleFavorite, onOpen }) => {
  return (
    <button
      type="button"
      onClick={() => onOpen?.(item._id)}
      className="
        group
        relative
        w-full
        overflow-hidden
        rounded-2xl
        border border-neutral-200 dark:border-neutral-700
        bg-white dark:bg-neutral-900
        transition-all duration-300
        hover:-translate-y-0.5
        hover:shadow-[0_12px_30px_-12px_rgba(0,0,0,0.15)]
        dark:hover:shadow-[0_12px_30px_-12px_rgba(0,0,0,0.6)]
        active:scale-[0.98]
      "
    >
      {/* Favorite */}
      <div
        onClick={(e) => {
          e.stopPropagation()
          onToggleFavorite(item._id)
        }}
        className="
          absolute top-3 right-3 z-10
          rounded-full p-2
          bg-white/80 dark:bg-neutral-900/80
          backdrop-blur
          border border-neutral-200 dark:border-neutral-700
          opacity-0 group-hover:opacity-100
          transition
        "
      >
        <Heart
          size={16}
          className={
            item.isFavorite
              ? 'fill-red-500 text-red-500'
              : 'text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300'
          }
        />
      </div>

      {/* Image */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={item.imageUrl}
          alt={item.category}
          loading="lazy"
          className="
            h-full w-full object-cover
            transition-transform duration-500
            group-hover:scale-[1.04]
          "
        />

        {/* Subtle gradient for text legibility */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/40 to-transparent" />
      </div>

      {/* Meta */}
      <div className="p-3 space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-[11px] uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
            {item.category}
          </p>

          {item.size && (
            <span className="text-[11px] text-neutral-400 dark:text-neutral-500">
              {item.size}
            </span>
          )}
        </div>

        {/* Colors */}
        {item.colors?.length > 0 && (
          <div className="flex gap-1.5">
            {item.colors.slice(0, 4).map((color) => (
              <span
                key={color}
                className="
                  h-3.5 w-3.5 rounded-full
                  border border-black/10 dark:border-white/10
                "
                style={{ backgroundColor: color }}
              />
            ))}
            {item.colors.length > 4 && (
              <span className="text-xs text-neutral-400">
                +{item.colors.length - 4}
              </span>
            )}
          </div>
        )}
      </div>
    </button>
  )
}

export default WardrobeCard
