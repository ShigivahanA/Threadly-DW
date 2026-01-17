import { Link } from 'react-router-dom'

const EmptyState = ({ onReset }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      
      {/* Visual anchor */}
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-neutral-200 dark:border-neutral-700">
        <span className="block h-8 w-8 rounded border border-dashed border-neutral-400 dark:border-neutral-500" />
      </div>

      {/* Title */}
      <h2 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
        Your wardrobe is empty
      </h2>

      {/* Description */}
      <p className="mt-2 max-w-sm text-sm text-neutral-500 dark:text-neutral-400">
        This space is reserved for pieces you love.
        Upload your first item or adjust filters to begin curating.
      </p>

      {/* Actions */}
      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <button
          onClick={onReset}
          className="
            inline-flex items-center justify-center
            rounded-xl border
            border-neutral-300 dark:border-neutral-700
            px-4 py-2 text-sm
            text-neutral-700 dark:text-neutral-300
            transition
            hover:bg-neutral-100 dark:hover:bg-neutral-800
          "
        >
          Clear filters
        </button>

        <Link
          to="/upload"
          className="
            inline-flex items-center justify-center
            rounded-xl
            bg-black dark:bg-white
            px-4 py-2 text-sm font-medium
            text-white dark:text-black
            transition
            hover:opacity-90
          "
        >
          Add your first item
        </Link>
      </div>
    </div>
  )
}

export default EmptyState
