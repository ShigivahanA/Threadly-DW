import { useEffect, useState } from 'react'
import apiClient from '../services/apiClient'
import { useAuth } from '../context/AuthContext'

const useHome = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth()

  const [homeData, setHomeData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!isAuthenticated || authLoading) {
      return
    }

    const fetchHome = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await apiClient.get('/home')

        setHomeData(response.data)
      } catch (err) {
        setError(err.message || 'Failed to load home data')
      } finally {
        setLoading(false)
      }
    }

    fetchHome()
  }, [isAuthenticated, authLoading])

  return {
    user: homeData?.user || null,
    wardrobePreview: homeData?.wardrobePreview || [],
    outfitSuggestions: homeData?.outfitSuggestions || [],
    loading,
    error
  }
}

export default useHome
