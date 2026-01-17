const WardrobeItemSkeleton = () => {
  return (
    <div className="mx-auto max-w-lg px-4 py-6 space-y-6 animate-pulse">
      {/* Image skeleton */}
      <div className="aspect-square w-full rounded-2xl bg-neutral-200 dark:bg-neutral-800" />

      {/* Metadata skeleton */}
      <div className="space-y-4">
        <div className="h-10 w-full rounded-lg bg-neutral-200 dark:bg-neutral-800" />
        <div className="h-10 w-full rounded-lg bg-neutral-200 dark:bg-neutral-800" />
        <div className="h-10 w-full rounded-lg bg-neutral-200 dark:bg-neutral-800" />

        {/* Color picker placeholder */}
        <div className="h-40 w-full rounded-xl bg-neutral-200 dark:bg-neutral-800" />

        <div className="h-20 w-full rounded-lg bg-neutral-200 dark:bg-neutral-800" />
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <div className="h-11 w-full rounded-xl bg-neutral-300 dark:bg-neutral-700" />
        <div className="h-4 w-20 mx-auto rounded bg-neutral-200 dark:bg-neutral-800" />
      </div>
    </div>
  )
}

export default WardrobeItemSkeleton
