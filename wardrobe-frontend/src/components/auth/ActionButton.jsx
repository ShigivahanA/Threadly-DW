import Spinner from '../ui/Spinner'

const ActionButton = ({ children, loading, onClick }) => {
  return (
    <button
      type="button"
      disabled={loading}
      onClick={onClick}
      className="
        relative
        w-full
        h-11
        flex items-center justify-center
        rounded-xl
        bg-black dark:bg-white
        text-white dark:text-black
        font-medium
        transition
        hover:opacity-90
        disabled:opacity-50
      "
    >
      <span
        className={`
          transition-opacity duration-200
          ${loading ? 'opacity-0' : 'opacity-100'}
        `}
      >
        {children}
      </span>

      {loading && (
        <span className="absolute">
          <Spinner />
        </span>
      )}
    </button>
  )
}

export default ActionButton
