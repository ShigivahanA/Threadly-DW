const UploadProgress = () => {
  return (
    <div
      className="
        relative
        flex items-center gap-3
        rounded-xl
        border
        border-neutral-200 dark:border-neutral-700
        bg-white dark:bg-neutral-900
        px-4 py-3
        shadow-sm
      "
    >
      {/* Spinner */}
      <span
        className="
          relative
          h-4 w-4
          rounded-full
          border-2
          border-neutral-300 dark:border-neutral-600
          border-t-black dark:border-t-white
          animate-spin
        "
      />

      {/* Text */}
      <div className="flex flex-col leading-tight">
        <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
          Uploading image
        </span>
        <span className="text-xs text-neutral-500 dark:text-neutral-400">
          Please don’t close the app
        </span>
      </div>

      {/* Ambient shimmer (very subtle) */}
      <div
        className="
          pointer-events-none
          absolute inset-0
          rounded-xl
          overflow-hidden
        "
      >
        <div
          className="
            absolute -inset-x-1/2 inset-y-0
            bg-gradient-to-r
            from-transparent
            via-white/20 dark:via-white/10
            to-transparent
            animate-[shimmer_2s_linear_infinite]
          "
        />
      </div>
    </div>
  )
}

export default UploadProgress
