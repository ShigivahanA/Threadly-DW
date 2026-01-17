import { useEffect, useState } from 'react'
import wardrobeService from '../services/wardrobeService'
import { useNavigate } from 'react-router-dom'
import WardrobeHeader from '../components/wardrobe/WardrobeHeader'
import WardrobeFilters from '../components/wardrobe/WardrobeFilters'
import WardrobeGrid from '../components/wardrobe/WardrobeGrid'
import WardrobeSkeleton from '../components/wardrobe/WardrobeSkeleton'
import EmptyState from '../components/wardrobe/EmptyState'

import useWardrobeFilters from '../hooks/useWardrobeFilters'

const Wardrobe = () => {
  const navigate = useNavigate()
  const [items, setItems] = useState([])
  const [cursor, setCursor] = useState(null)
  const [loading, setLoading] = useState(true)

  const openItem = (id) => {
    navigate(`/wardrobe/${id}`)
  }

  const { filters, setFilter, resetFilters } = useWardrobeFilters()

  const loadItems = async (reset = false) => {
  try {
    setLoading(true)

    const query = new URLSearchParams({
      ...filters,
      ...(reset ? {} : { cursor })
    }).toString()

    const data = await wardrobeService.getItems(
      query ? `?${query}` : ''
    )

    // ✅ HARD SAFETY
    const itemsFromApi = data?.items ?? []
    const nextCursorFromApi = data?.nextCursor ?? null

    setItems(prev =>
      reset ? itemsFromApi : [...prev, ...itemsFromApi]
    )
    setCursor(nextCursorFromApi)
  } catch (err) {
    console.error('Failed to load wardrobe items:', err)
    setItems([])
    setCursor(null)
  } finally {
    setLoading(false)
  }
}

const handleToggleFavorite = async (id) => {
  try {
    const data = await wardrobeService.toggleFavorite(id)

    setItems((prev) =>
      prev.map((item) =>
        item._id === id
          ? { ...item, isFavorite: data.isFavorite }
          : item
      )
    )
  } catch (err) {
    console.error('Failed to toggle favorite', err)
  }
}


  useEffect(() => {
    loadItems(true)
  }, [filters])

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 space-y-6">
      <WardrobeHeader count={items.length} />

      <WardrobeFilters
        filters={filters}
        setFilter={setFilter}
        resetFilters={resetFilters}
      />

      {loading && items.length === 0 && <WardrobeSkeleton />}

      {!loading && items.length === 0 && (
        <EmptyState onReset={resetFilters} />
      )}

      {items.length > 0 && (
        <WardrobeGrid items={items} onToggleFavorite={handleToggleFavorite} onOpenItem={openItem} />
      )}

      {cursor && !loading && (
        <button
          onClick={() => loadItems()}
          className="w-full rounded-xl border py-2 text-sm"
        >
          Load more
        </button>
      )}
    </div>
  )
}

export default Wardrobe
