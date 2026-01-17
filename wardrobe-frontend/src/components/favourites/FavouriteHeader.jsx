const FavouriteHeader = ({ count }) => {
  return (
    <header className="space-y-1">
      <h1 className="text-2xl font-semibold tracking-tight dark:text-neutral-500">
        Favourites
      </h1>
      <p className="text-sm text-neutral-500 dark:text-neutral-400">
        {count} curated piece{count !== 1 ? 's' : ''}
      </p>
    </header>
  )
}

export default FavouriteHeader
