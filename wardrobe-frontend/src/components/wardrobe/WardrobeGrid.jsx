import WardrobeCard from './WardrobeCard'

const WardrobeGrid = ({ items,onToggleFavorite, onOpenItem }) => {
  return (
    <div
      className="
        grid
        grid-cols-2
        gap-x-3 gap-y-4
        sm:grid-cols-3
        md:grid-cols-4
        lg:grid-cols-5
        transition-all
        duration-300
      "
    >
      {items.map((item) => (
        <div
          key={item._id}
          className="animate-fade-in"
        >
          <WardrobeCard
            item={item}
            onToggleFavorite={onToggleFavorite}
            onOpen={onOpenItem}
          />
        </div>
      ))}
    </div>
  )
}

export default WardrobeGrid
