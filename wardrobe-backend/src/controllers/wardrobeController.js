import WardrobeItem from '../models/WardrobeItem.js'
import asyncHandler from '../utils/asyncHandler.js'
import AppError from '../utils/AppError.js'
import { successResponse } from '../utils/response.js'
import cloudinary from '../config/cloudinary.js'


/**
 * @desc    Add new wardrobe item
 * @route   POST /api/wardrobe
 * @access  Private
 */
export const addItem = asyncHandler(async (req, res, next) => {
  const { imageUrl,
  imagePublicId,
  category,
  colors,
  season,
  tags,
  size,
  brand,
  occasion,
  isFavorite,
  notes } = req.body

  if (!imageUrl || !imagePublicId || !category) {
    throw new AppError('Required fields missing', 400)
  }

  const item = await WardrobeItem.create({
    userId: req.user.id,
    imageUrl,
  imagePublicId,
  category,
  colors,
  season,
  tags,
  size,
  brand,
  occasion,
  isFavorite,
  notes
  })

  successResponse(res, {
    statusCode: 201,
    message: 'Item added to wardrobe',
    data: item
  })
})

/**
 * @desc    Get wardrobe items (paginated + filtered)
 * @route   GET /api/wardrobe
 * @access  Private
 */
export const getItems = asyncHandler(async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit, 10) || 20, 50)
  const { cursor, category, favorite } = req.query

  const query = {
    userId: req.user.id
  }

  /* ======================
     Filters
  ====================== */

  if (category) {
    query.category = category
  }

  if (favorite === 'true') {
    query.isFavorite = true
  }

  /* ======================
     Pagination
  ====================== */

  if (cursor) {
    query._id = { $lt: cursor }
  }

  const items = await WardrobeItem.find(query)
    .sort({ _id: -1 })
    .limit(limit + 1)

  let nextCursor = null
  if (items.length > limit) {
    nextCursor = items[limit]._id
    items.pop()
  }

  successResponse(res, {
    message: 'Wardrobe items fetched',
    data: {
      items,
      nextCursor
    }
  })
})


/**
 * @desc    Get single wardrobe item
 * @route   GET /api/wardrobe/:id
 * @access  Private
 */
export const getItemById = asyncHandler(async (req, res, next) => {
  const item = await WardrobeItem.findOne({
    _id: req.params.id,
    userId: req.user.id
  })

  if (!item) {
    throw new AppError('Item not found', 404)
  }

  successResponse(res, {
    message: 'Item fetched',
    data: item
  })
})

/**
 * @desc    Delete wardrobe item + cleanup Cloudinary
 * @route   DELETE /api/wardrobe/:id
 * @access  Private
 */
export const deleteItem = asyncHandler(async (req, res, next) => {
  const item = await WardrobeItem.findOne({
    _id: req.params.id,
    userId: req.user.id
  })

  if (!item) {
    throw new AppError('Item not found or not authorized', 404)
  }

  // Delete DB record first
  await item.deleteOne()

  // Cleanup Cloudinary (best-effort)
  try {
    await cloudinary.uploader.destroy(item.imagePublicId)
  } catch (error) {
    console.error(
      `⚠️ Cloudinary cleanup failed for ${item.imagePublicId}`,
      error.message
    )
  }

  successResponse(res, {
    message: 'Item removed from wardrobe',
    data: null
  })
})


/**
 * @desc    Update wardrobe item metadata
 * @route   PATCH /api/wardrobe/:id
 * @access  Private
 */
export const updateItem = asyncHandler(async (req, res) => {
  const item = await WardrobeItem.findOne({
    _id: req.params.id,
    userId: req.user.id
  })

  if (!item) {
    throw new AppError('Item not found', 404)
  }

  Object.assign(item, req.body)
  await item.save()

  successResponse(res, {
    message: 'Item updated',
    data: item
  })
})

/**
 * @desc    Toggle favorite
 * @route   PATCH /api/wardrobe/:id/favorite
 */
export const toggleFavorite = asyncHandler(async (req, res) => {
  const item = await WardrobeItem.findOne({
    _id: req.params.id,
    userId: req.user.id
  })

  if (!item) {
    throw new AppError('Item not found', 404)
  }

  item.isFavorite = !item.isFavorite
  await item.save()

  successResponse(res, {
    message: 'Favorite updated',
    data: { isFavorite: item.isFavorite }
  })
})
