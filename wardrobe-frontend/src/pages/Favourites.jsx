import { useEffect, useState } from 'react'
import wardrobeService from '../services/wardrobeService'

import FavouriteHeader from '../components/favourites/FavouriteHeader'
import FavouriteGrid from '../components/favourites/FavouriteGrid'
import FavouriteSkeleton from '../components/favourites/FavouriteSkeleton'
import FavouriteEmpty from '../components/favourites/FavouriteEmpty'

const Favourites = () => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    const load = async () => {
      try {
        const res = await wardrobeService.getItems('?favorite=true')
        if (mounted) setItems(res?.items ?? [])
      } catch {
        if (mounted) setItems([])
      } finally {
        if (mounted) setLoading(false)
      }
    }

    load()
    return () => { mounted = false }
  }, [])

  if (loading) return <FavouriteSkeleton />

  if (items.length === 0) {
    return <FavouriteEmpty />
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 space-y-8">
      <FavouriteHeader count={items.length} />
      <FavouriteGrid items={items} />
    </div>
  )
}

export default Favourites
