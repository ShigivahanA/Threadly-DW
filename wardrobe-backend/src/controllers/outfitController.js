import Outfit from '../models/Outfit.js'
import asyncHandler from '../utils/asyncHandler.js'
import AppError from '../utils/AppError.js'
import { successResponse } from '../utils/response.js'

/**
 * @desc    Create outfit
 * @route   POST /api/outfits
 */
export const createOutfit = asyncHandler(async (req, res) => {
  const { items, occasion, notes } = req.body

  if (
    !items ||
    !items.top ||
    !items.bottom ||
    !items.footwear
  ) {
    throw new AppError('Invalid outfit items', 400)
  }

  const outfit = await Outfit.create({
    userId: req.user.id,
    items: {
      top: items.top,
      bottom: items.bottom,
      footwear: items.footwear
    },
    occasion,
    notes,
    wearCount: 1,
    lastWornAt: new Date()
  })

  successResponse(res, {
    statusCode: 201,
    message: 'Outfit saved',
    data: outfit
  })
})


/**
 * @desc    Get outfits
 * @route   GET /api/outfits
 */
export const getOutfits = asyncHandler(async (req, res) => {
  const outfits = await Outfit.find({ userId: req.user.id })
    .sort({ createdAt: -1 })
    .populate('items.top items.bottom items.footwear')

  successResponse(res, {
    message: 'Outfits fetched',
    data: outfits
  })
})

/**
 * @desc    Get single outfit
 * @route   GET /api/outfits/:id
 */
export const getOutfitById = asyncHandler(async (req, res) => {
  const outfit = await Outfit.findOne({
    _id: req.params.id,
    userId: req.user.id
  }).populate('items.top items.bottom items.footwear')

  if (!outfit) {
    throw new AppError('Outfit not found', 404)
  }

  successResponse(res, {
    message: 'Outfit fetched',
    data: outfit
  })
})

/**
 * @desc    Update outfit metadata
 * @route   PATCH /api/outfits/:id
 */
export const updateOutfit = asyncHandler(async (req, res) => {
  const outfit = await Outfit.findOne({
    _id: req.params.id,
    userId: req.user.id
  })

  if (!outfit) {
    throw new AppError('Outfit not found', 404)
  }

  Object.assign(outfit, req.body)
  await outfit.save()

  successResponse(res, {
    message: 'Outfit updated',
    data: outfit
  })
})

/**
 * @desc    Increment wear count
 * @route   PATCH /api/outfits/:id/wear
 */
export const incrementWear = asyncHandler(async (req, res) => {
  const outfit = await Outfit.findOne({
    _id: req.params.id,
    userId: req.user.id
  })

  if (!outfit) {
    throw new AppError('Outfit not found', 404)
  }

  outfit.wearCount += 1
  outfit.lastWornAt = new Date()
  await outfit.save()

  successResponse(res, {
    message: 'Wear count updated',
    data: {
      wearCount: outfit.wearCount,
      lastWornAt: outfit.lastWornAt
    }
  })
})

/**
 * @desc    Delete outfit
 * @route   DELETE /api/outfits/:id
 */
export const deleteOutfit = asyncHandler(async (req, res) => {
  const outfit = await Outfit.findOneAndDelete({
    _id: req.params.id,
    userId: req.user.id
  })

  if (!outfit) {
    throw new AppError('Outfit not found', 404)
  }

  successResponse(res, {
    message: 'Outfit deleted',
    data: null
  })
})
