import { useState } from 'react'

const useWardrobeFilters = () => {
  const [filters, setFilters] = useState({
    category: '',
    favorite: false
  })

  const setFilter = (key, value) => {
    setFilters(p => ({ ...p, [key]: value }))
  }

  const resetFilters = () => {
    setFilters({
      category: '',
      favorite: false
    })
  }

  return { filters, setFilter, resetFilters }
}

export default useWardrobeFilters
