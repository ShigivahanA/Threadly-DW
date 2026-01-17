import apiClient from './apiClient'

const createOutfit = async (payload) => {
  const res = await apiClient.post('/outfits', payload)
  return res.data
}

const getOutfits = async () => {
  const res = await apiClient.get('/outfits')
  return res.data
}

const getOutfitById = async (id) => {
  const res = await apiClient.get(`/outfits/${id}`)
  return res.data
}

const markWorn = async (id) => {
  const res = await apiClient.patch(`/outfits/${id}/wear`)
  return res.data          // 👈 IMPORTANT
}

export default {
  createOutfit,
  getOutfits,
  getOutfitById,
  markWorn
}
