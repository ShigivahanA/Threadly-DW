const ImagePreview = ({ src, uploaded }) => {
  return (
    <div
      className="
        relative
        rounded-2xl
        overflow-hidden
        border
        border-neutral-200 dark:border-neutral-700
        bg-neutral-100 dark:bg-neutral-900
        shadow-sm
      "
    >
      {/* Image */}
      <img
        src={src}
        alt="Preview"
        className="
          w-full
          aspect-[3/4]
          object-cover
          transition-transform duration-500
          hover:scale-[1.02]
        "
        draggable={false}
      />

      {/* Soft gradient for legibility */}
      <div
        className="
          pointer-events-none
          absolute inset-0
          bg-gradient-to-t
          from-black/30 via-black/5 to-transparent
        "
      />

      {/* Status badge */}
      {uploaded && (
        <div
          className="
            absolute
            top-3 right-3
            rounded-full
            bg-black/70 dark:bg-white/90
            px-3 py-1
            text-xs font-medium
            text-white dark:text-black
            backdrop-blur
          "
        >
          Uploaded
        </div>
      )}

      {/* Bottom caption */}
      <div
        className="
          absolute bottom-0 left-0 right-0
          px-3 py-2
          text-xs
          text-white/90
          flex items-center justify-between
        "
      >
        <span className="opacity-90">
          Image preview
        </span>

        {uploaded && (
          <span className="opacity-70">
            Ready to tag
          </span>
        )}
      </div>
    </div>
  )
}

export default ImagePreview
