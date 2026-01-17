const PairingSkeleton = () => {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 space-y-10">
      {[1, 2, 3].map((row) => (
        <div key={row} className="space-y-4">
          <div className="h-4 w-24 mx-auto bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
          <div className="flex justify-center gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-44 aspect-square rounded-2xl bg-neutral-200 dark:bg-neutral-700 animate-pulse"
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default PairingSkeleton
