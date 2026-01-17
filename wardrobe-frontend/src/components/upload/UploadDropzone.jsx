const UploadDropzone = ({ onSelect, file, onRemove }) => {
  const handleChange = (e) => {
    const selected = e.target.files?.[0]
    if (selected) onSelect(selected)
  }

  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div className="rounded-2xl border border-dashed dark:border-neutral-700">

      {/* EMPTY STATE */}
      {!file && (
        <label className="
          flex flex-col items-center justify-center
          p-6 text-center cursor-pointer
          bg-white dark:bg-neutral-900
          rounded-2xl
          transition
          hover:bg-neutral-50 dark:hover:bg-neutral-800
        ">
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={handleChange}
          />

          <div className="flex flex-col items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
              <span className="text-lg">📷</span>
            </div>

            <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Upload an image
            </p>

            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              JPG, PNG, WEBP
            </p>
          </div>
        </label>
      )}

      {/* FILE SELECTED STATE */}
      {file && (
        <div className="
          p-4
          bg-white dark:bg-neutral-900
          rounded-2xl
          flex items-center justify-between gap-4
        ">
          <div className="min-w-0">
            <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200 truncate">
              {file.name}
            </p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              {formatSize(file.size)}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <label className="text-sm underline cursor-pointer text-neutral-600 dark:text-neutral-400">
              Change
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleChange}
              />
            </label>

            <button
              type="button"
              onClick={onRemove}
              className="text-sm underline text-red-500"
            >
              Remove
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default UploadDropzone
