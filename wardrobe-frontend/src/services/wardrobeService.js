import apiClient from './apiClient'

/* ======================
   Wardrobe Service
====================== */

const getItems = async (query = '') => {
  const res = await apiClient.get(`/wardrobe${query}`)
  return res.data          // ✅ FIX
}

const getItemById = async (id) => {
  const res = await apiClient.get(`/wardrobe/${id}`)
  return res.data          // ✅ FIX
}

const addItem = async (payload) => {
  const res = await apiClient.post('/wardrobe', payload)
  return res.data          // ✅ FIX
}

const updateItem = async (id, payload) => {
  const res = await apiClient.patch(`/wardrobe/${id}`, payload)
  return res.data          // ✅ FIX
}

const deleteItem = async (id) => {
  await apiClient.delete(`/wardrobe/${id}`)
}

const toggleFavorite = async (id) => {
  const res = await apiClient.patch(`/wardrobe/${id}/favorite`)
  return res.data          // ✅ FIX
}

const wardrobeService = {
  getItems,
  getItemById,
  addItem,
  updateItem,
  deleteItem,
  toggleFavorite
}

export default wardrobeService
