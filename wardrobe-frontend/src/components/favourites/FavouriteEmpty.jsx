import { Link } from 'react-router-dom'

const FavouriteEmpty = () => {
  return (
    <div className="py-24 text-center space-y-4">
      <p className="text-sm text-neutral-500 dark:text-neutral-400">
        You haven’t marked anything as favourite yet
      </p>

      <Link
        to="/wardrobe"
        className="
          inline-block
          text-sm underline
          text-neutral-700 dark:text-neutral-300
        "
      >
        Browse wardrobe
      </Link>
    </div>
  )
}

export default FavouriteEmpty
