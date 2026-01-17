const UploadActions = ({
  primaryText,
  secondaryText,
  onPrimary,
  onSecondary,
  loading
}) => {
  return (
    <div className="flex flex-col gap-3">
      <button
        disabled={loading}
        onClick={onPrimary}
        className="rounded-xl bg-black dark:bg-white text-white dark:text-black py-2 font-medium"
      >
        {primaryText}
      </button>

      {secondaryText && (
        <button
          type="button"
          onClick={onSecondary}
          className="text-sm underline text-neutral-600 dark:text-neutral-400"
        >
          {secondaryText}
        </button>
      )}
    </div>
  )
}

export default UploadActions
