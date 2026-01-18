const OutfitDetailSkeleton = () => {
  return (
    <div className="mx-auto max-w-xl px-4 py-10 space-y-8 animate-pulse">
      {/* Title */}
      <div className="h-6 w-40 mx-auto rounded bg-neutral-200 dark:bg-neutral-800" />

      {/* Outfit images */}
      <div className="grid grid-cols-3 gap-2">
        {[1, 2, 3].map(i => (
          <div
            key={i}
            className="
              aspect-square
              rounded-xl
              bg-neutral-200 dark:bg-neutral-800
            "
          />
        ))}
      </div>

      {/* Stats */}
      <div className="space-y-2 text-center">
        <div className="h-4 w-32 mx-auto rounded bg-neutral-200 dark:bg-neutral-800" />
        <div className="h-3 w-40 mx-auto rounded bg-neutral-200 dark:bg-neutral-800" />
      </div>

      {/* Button */}
      <div className="h-11 w-full rounded-xl bg-neutral-300 dark:bg-neutral-700" />
    </div>
  )
}

export default OutfitDetailSkeleton
