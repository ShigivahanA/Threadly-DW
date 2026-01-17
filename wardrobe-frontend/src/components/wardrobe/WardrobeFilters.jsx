const categories = [
  'shirt',
  'tshirt',
  'pant',
  'jeans',
  'jacket',
  'shoes'
]

const WardrobeFilters = ({ filters, setFilter, resetFilters }) => {
  return (
    <div className="space-y-3">
      {/* Category pills */}
      <div
        className="
          flex gap-2
          overflow-x-auto
          pb-1
          -mx-1 px-1
          scrollbar-hide
        "
      >
        {categories.map((cat) => {
          const active = filters.category === cat

          return (
            <button
              key={cat}
              type="button"
              onClick={() =>
                setFilter('category', active ? '' : cat)
              }
              className={`
                shrink-0
                rounded-full
                px-4 py-1.5
                text-sm capitalize
                transition-all duration-200
                border
                ${
                  active
                    ? `
                      bg-neutral-900 text-white
                      border-neutral-900
                      dark:bg-white dark:text-black
                      dark:border-white
                    `
                    : `
                      bg-transparent
                      text-neutral-600 dark:text-neutral-400
                      border-neutral-300 dark:border-neutral-700
                      hover:border-neutral-400 dark:hover:border-neutral-500
                    `
                }
              `}
            >
              {cat}
            </button>
          )
        })}
      </div>

      {/* Reset */}
      {(filters.category || filters.favorite) && (
        <button
          type="button"
          onClick={resetFilters}
          className="
            inline-flex items-center gap-1
            text-xs
            text-neutral-500 dark:text-neutral-400
            hover:text-neutral-700 dark:hover:text-neutral-200
            transition
          "
        >
          Reset filters
        </button>
      )}
    </div>
  )
}

export default WardrobeFilters
