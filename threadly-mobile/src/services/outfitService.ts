import { request } from './apiClient'

/* ======================
   Types
====================== */

export type OutfitItemRef = {
  _id: string
  imageUrl: string
  category?: string
  size?: string
}

export type Outfit = {
  _id: string
  items: {
    top: OutfitItemRef
    bottom: OutfitItemRef
    footwear: OutfitItemRef
  }
  occasion?: string
  wearCount: number
  createdAt: string
}

/* ======================
   Outfit Service
====================== */

/**
 * Create a new outfit
 */
const createOutfit = async (payload: {
  items: {
    top: string
    bottom: string
    footwear: string
  }
  occasion?: string
}): Promise<Outfit> => {
  return request<Outfit>('/outfits', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

/**
 * Get all saved outfits
 */
const getOutfits = async (): Promise<Outfit[]> => {
  return request<Outfit[]>('/outfits')
}

/**
 * Get a single outfit by ID
 */
const getOutfitById = async (id: string): Promise<Outfit> => {
  return request<Outfit>(`/outfits/${id}`)
}

/**
 * Mark an outfit as worn
 */
const markWorn = async (id: string): Promise<Outfit> => {
  return request<Outfit>(`/outfits/${id}/wear`, {
    method: 'PATCH',
  })
}

/* ======================
   Export
====================== */

const outfitService = {
  createOutfit,
  getOutfits,
  getOutfitById,
  markWorn,
}

export default outfitService
