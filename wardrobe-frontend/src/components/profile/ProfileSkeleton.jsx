const ProfileSkeleton = () => {
  return (
    <div className="px-4 py-16 animate-pulse">
      <div className="mx-auto max-w-2xl space-y-10">

        <div className="h-6 w-48 bg-neutral-200 dark:bg-neutral-800 rounded" />
        <div className="h-4 w-72 bg-neutral-200 dark:bg-neutral-800 rounded" />

        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-12 bg-neutral-200 dark:bg-neutral-800 rounded-xl"
          />
        ))}
      </div>
    </div>
  )
}

export default ProfileSkeleton
