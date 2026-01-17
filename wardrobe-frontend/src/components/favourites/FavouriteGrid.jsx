import WardrobeCard from '../wardrobe/WardrobeCard'
import { useNavigate } from 'react-router-dom'
import wardrobeService from '../../services/wardrobeService'

const FavouriteGrid = ({ items }) => {
  const navigate = useNavigate()

  const openItem = (id) => {
    navigate(`/wardrobe/${id}`)
  }

  const toggleFavorite = async (id) => {
    await wardrobeService.toggleFavorite(id)
  }

  return (
    <div
      className="
        grid grid-cols-2
        gap-x-3 gap-y-5
        sm:grid-cols-3
        md:grid-cols-4
        lg:grid-cols-5
      "
    >
      {items.map(item => (
        <WardrobeCard
          key={item._id}
          item={item}
          onOpen={openItem}
          onToggleFavorite={toggleFavorite}
        />
      ))}
    </div>
  )
}

export default FavouriteGrid
