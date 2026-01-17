const WardrobeHeader = ({ count }) => {
  return (
    <header className="space-y-2">
      <h1
        className="
          text-2xl
          font-semibold
          tracking-tight
          text-neutral-900
          dark:text-neutral-100
        "
      >
        Your Wardrobe
      </h1>

      <p
        className="
          text-sm
          text-neutral-500
          dark:text-neutral-400
        "
      >
        {count === 0
          ? 'No pieces added yet'
          : `${count} piece${count !== 1 ? 's' : ''}`}
      </p>
    </header>
  )
}

export default WardrobeHeader
