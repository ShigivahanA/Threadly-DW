import { request } from './apiClient'

/* ======================
   Types
====================== */
export type WardrobeCategory =
  | 'shirt'
  | 'tshirt'
  | 'pant'
  | 'jeans'
  | 'jacket'
  | 'shoes'
  | 'other'

  export type WardrobeOccasion =
  | 'casual'
  | 'formal'
  | 'party'
  | 'ethnic'
  | 'sports'
  | 'other'

export type WardrobeSeason =
  | 'summer'
  | 'winter'
  | 'all'


export interface AddWardrobeItemPayload {
  imageUrl: string
  imagePublicId: string
  category: WardrobeCategory
  colors?: string[]
  size?: string
  brand?: string
  occasion?: 'casual' | 'formal' | 'party' | 'ethnic' | 'sports' | 'other'
  season?: 'summer' | 'winter' | 'all'
  isFavorite?: boolean
  tags?: string[]
  notes?: string
}

/* ======================
   Service
====================== */

const addItem = async (payload: AddWardrobeItemPayload) => {
  const res = await request('/wardrobe', {
    method: 'POST',
    body: JSON.stringify(payload),
  })

  return res.data
}

const getItems = async (query = '') => {
  const res = await request(`/wardrobe${query}`, {
    method: 'GET',
  })

  return res.data
}

const getItemById = async (id: string) => {
  const res = await request(`/wardrobe/${id}`, {
    method: 'GET',
  })

  return res.data
}

const deleteItem = async (id: string) => {
  await request(`/wardrobe/${id}`, {
    method: 'DELETE',
  })
}

const updateItem = async (id: string, payload: Partial<AddWardrobeItemPayload>) => {
  const res = await request(`/wardrobe/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })

  return res.data
}

const toggleFavorite = async (id: string) => {
  const res = await request(`/wardrobe/${id}/favorite`, {
    method: 'PATCH',
  })

  return res.data
}

/* ======================
   Default export (CRITICAL)
====================== */
const wardrobeService = {
  addItem,
  getItems,
  getItemById,
  updateItem,
  deleteItem,
  toggleFavorite,
}

export default wardrobeService
