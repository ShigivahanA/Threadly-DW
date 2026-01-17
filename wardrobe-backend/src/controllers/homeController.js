import User from '../models/User.js'
import WardrobeItem from '../models/WardrobeItem.js'
import asyncHandler from '../utils/asyncHandler.js'
import AppError from '../utils/AppError.js'
import { successResponse } from '../utils/response.js'

/**
 * @desc    Home bootstrap data
 * @route   GET /api/home
 * @access  Private
 */
export const getHomeData = asyncHandler(async (req, res, next) => {
  const userId = req.user.id

  // 1. Minimal user info
  const user = await User.findById(userId).select('name avatarUrl')
  if (!user) {
    throw new AppError('User not found', 404)
  }

  // 2. Wardrobe preview (latest items)
  const wardrobePreview = await WardrobeItem.find({ userId })
    .sort({ createdAt: -1 })
    .limit(12)
    .select('imageUrl category colors')

  // 3. Outfit suggestions (simple rule-based)
  const outfitSuggestions = buildOutfitSuggestions(wardrobePreview)

  successResponse(res, {
    message: 'Home data fetched',
    data: {
      user,
      wardrobePreview,
      outfitSuggestions
    }
  })
})

/**
 * Simple rule-based outfit suggestions
 * No DB calls here
 */
const buildOutfitSuggestions = (items) => {
  const tops = items.filter((i) =>
    ['shirt', 'tshirt', 'jacket'].includes(i.category)
  )
  const bottoms = items.filter((i) =>
    ['pant', 'jeans'].includes(i.category)
  )

  const suggestions = []

  for (let top of tops) {
    for (let bottom of bottoms) {
      if (isColorCompatible(top.colors, bottom.colors)) {
        suggestions.push({
          top: {
            id: top._id,
            imageUrl: top.imageUrl
          },
          bottom: {
            id: bottom._id,
            imageUrl: bottom.imageUrl
          },
          reason: 'Color match'
        })
      }
      if (suggestions.length >= 3) break
    }
    if (suggestions.length >= 3) break
  }

  return suggestions
}

/**
 * Very simple color compatibility logic (MVP)
 */
const isColorCompatible = (topColors = [], bottomColors = []) => {
  const neutralColors = ['black', 'white', 'grey', 'blue', 'beige']

  return (
    topColors.some((c) => neutralColors.includes(c)) ||
    bottomColors.some((c) => neutralColors.includes(c))
  )
}
