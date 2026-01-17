const WardrobeSkeleton = () => {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="
            relative
            overflow-hidden
            rounded-xl
            border
            border-neutral-200
            dark:border-neutral-700
            bg-white
            dark:bg-neutral-800
          "
        >
          {/* Image placeholder */}
          <div
            className="
              aspect-square
              bg-neutral-200
              dark:bg-neutral-700
              animate-pulse
            "
          />

          {/* Meta placeholder */}
          <div className="p-2 space-y-2">
            <div
              className="
                h-3
                w-1/2
                rounded
                bg-neutral-200
                dark:bg-neutral-700
                animate-pulse
              "
            />

            <div className="flex gap-1">
              {Array.from({ length: 3 }).map((_, j) => (
                <div
                  key={j}
                  className="
                    h-3
                    w-3
                    rounded-full
                    bg-neutral-200
                    dark:bg-neutral-700
                    animate-pulse
                  "
                />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default WardrobeSkeleton
