const OutfitFolderSkeleton = () => {
  return (
    <div
      className="
        rounded-2xl border
        border-neutral-200 dark:border-neutral-700
        bg-neutral-100 dark:bg-neutral-900
        p-3
        animate-pulse
      "
    >
      {/* Image grid */}
      <div className="grid grid-cols-3 gap-1 rounded-xl overflow-hidden">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="
              aspect-square
              bg-neutral-200 dark:bg-neutral-800
            "
          />
        ))}
      </div>

      {/* Text lines */}
      <div className="mt-3 space-y-2">
        <div className="h-3 w-3/4 rounded bg-neutral-200 dark:bg-neutral-800" />
        <div className="h-3 w-1/2 rounded bg-neutral-200 dark:bg-neutral-800" />
      </div>
    </div>
  )
}

export default OutfitFolderSkeleton
