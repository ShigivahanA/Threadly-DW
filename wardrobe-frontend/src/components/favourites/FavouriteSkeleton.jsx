const FavouriteSkeleton = () => {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="
              aspect-square rounded-2xl
              bg-neutral-200 dark:bg-neutral-800
              animate-pulse
            "
          />
        ))}
      </div>
    </div>
  )
}

export default FavouriteSkeleton
