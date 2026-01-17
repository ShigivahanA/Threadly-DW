const PairingCard = ({ item, active, offset }) => {
  const scale =
    active ? 'scale-100' :
    Math.abs(offset) === 1 ? 'scale-[0.88]' :
    'scale-[0.75]'

  const opacity =
    active ? 'opacity-100' :
    Math.abs(offset) === 1 ? 'opacity-70' :
    'opacity-40'

  return (
    <div
      className={`
        relative
        aspect-[3/4]
        overflow-hidden
        rounded-2xl
        border
        bg-white dark:bg-neutral-900
        border-neutral-200 dark:border-neutral-700
        transition-all duration-500
        ${scale} ${opacity}
      `}
    >
      <img
        src={item.imageUrl}
        alt={item.category}
        className="h-full w-full object-cover"
        draggable={false}
      />

      {/* Focus ring */}
      {active && (
        <div className="pointer-events-none absolute inset-0 rounded-2xl ring-2 ring-black/10 dark:ring-white/20" />
      )}
    </div>
  )
}

export default PairingCard
