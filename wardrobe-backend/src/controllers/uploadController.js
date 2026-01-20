import cloudinary from '../config/cloudinary.js'
import asyncHandler from '../utils/asyncHandler.js'
import AppError from '../utils/AppError.js'
import { successResponse } from '../utils/response.js'

/**
 * @desc    Generate Cloudinary signed upload params
 * @route   POST /api/uploads/signature
 * @access  Private
 */
export const getUploadSignature = asyncHandler(async (req, res, next) => {
  const timestamp = Math.round(Date.now() / 1000)

  // Restrict transformations server-side
const uploadParams = {
  timestamp,
  folder: `wardrobe/${req.user.id}`,
  colors: true, 
  transformation: 'e_background_removal'
}


  try {
    const signature = cloudinary.utils.api_sign_request(
      uploadParams,
      cloudinary.config().api_secret
    )

    successResponse(res, {
      message: 'Upload signature generated',
      data: {
        timestamp,
        signature,
        cloudName: cloudinary.config().cloud_name,
        apiKey: cloudinary.config().api_key,
        uploadParams
      }
    })
  } catch (error) {
    throw new AppError('Failed to generate upload signature', 500)
  }
})
