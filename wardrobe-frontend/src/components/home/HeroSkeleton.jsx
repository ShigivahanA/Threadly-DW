const HeroSkeleton = () => {
  return (
    <section className="px-4 pt-20 pb-24">
      <div className="mx-auto max-w-4xl space-y-10 text-center animate-pulse">

        <div className="mx-auto h-3 w-40 rounded-full bg-neutral-200 dark:bg-neutral-700" />

        <div className="space-y-3">
          <div className="mx-auto h-10 w-72 rounded-lg bg-neutral-200 dark:bg-neutral-700" />
          <div className="mx-auto h-10 w-56 rounded-lg bg-neutral-200 dark:bg-neutral-700" />
        </div>

        <div className="space-y-2">
          <div className="mx-auto h-4 w-[70%] rounded bg-neutral-200 dark:bg-neutral-700" />
          <div className="mx-auto h-4 w-[55%] rounded bg-neutral-200 dark:bg-neutral-700" />
        </div>

        <div className="flex justify-center gap-4 pt-6">
          <div className="h-11 w-40 rounded-full bg-neutral-200 dark:bg-neutral-700" />
          <div className="h-11 w-32 rounded-full bg-neutral-200 dark:bg-neutral-700" />
        </div>

      </div>
    </section>
  )
}

export default HeroSkeleton
