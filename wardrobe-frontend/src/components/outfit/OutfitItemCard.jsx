const OutfitItemCard = ({ item }) => {
  return (
    <div
      className="
        group
        rounded-xl overflow-hidden
        border border-neutral-200 dark:border-neutral-700
        bg-white dark:bg-neutral-900
        transition
      "
    >
      {/* Image */}
      <div className="aspect-[3/4] overflow-hidden">
        <img
          src={item.imageUrl}
          alt={item.category}
          className="
            h-full w-full object-cover
            transition-transform duration-500
            group-hover:scale-[1.03]
          "
        />
      </div>

      {/* Meta */}
      <div className="p-2 text-center space-y-1">
        <p className="text-[10px] uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
          {item.category}
        </p>

        {item.size && (
          <p className="text-[11px] text-neutral-400 dark:text-neutral-500">
            Size {item.size}
          </p>
        )}
      </div>
    </div>
  )
}

export default OutfitItemCard
