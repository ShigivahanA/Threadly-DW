import User from '../models/User.js'
import asyncHandler from '../utils/asyncHandler.js'
import AppError from '../utils/AppError.js'
import { generateResetToken, hashResetToken } from '../utils/resetToken.js'
import { sendEmail } from '../utils/mailer.js'
import { resetPasswordEmail } from '../utils/emailTemplates.js'
import { successResponse } from '../utils/response.js'
import { hashPassword } from '../utils/password.js'

/**
 * POST /api/auth/password/forgot
 */
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body

  if (!email) {
    throw new AppError('Email is required', 400)
  }

  const normalizedEmail = email.toLowerCase().trim()
  const user = await User.findOne({ email: normalizedEmail })

  // security: never reveal user existence
  if (!user) {
    return successResponse(res, {
      message: 'If the email exists, reset link has been sent'
    })
  }

  const resetToken = generateResetToken()
  const hashedToken = hashResetToken(resetToken)

  user.passwordReset = {
    token: hashedToken,
    expiresAt: new Date(Date.now() + 15 * 60 * 1000) // 15 min
  }

  await user.save()

  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`

  const emailContent = resetPasswordEmail(resetLink)
  await sendEmail({
    to: user.email,
    subject: emailContent.subject,
    html: emailContent.html,
    text: emailContent.text
  })

  successResponse(res, {
    message: 'If the email exists, reset link has been sent'
  })
})


/**
 * POST /api/auth/password/reset
 */
export const resetPassword = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body

  if (!token || !newPassword) {
    throw new AppError('Token and new password required', 400)
  }

  const hashedToken = hashResetToken(token)

  const user = await User.findOne({
    'passwordReset.token': hashedToken
  }).select('+refreshToken')

  if (!user || user.passwordReset.expiresAt < new Date()) {
    throw new AppError('Invalid or expired reset token', 401)
  }

  // update password
  user.password = await hashPassword(newPassword)

  // invalidate sessions
  user.refreshToken = null
  user.passwordReset = undefined

  await user.save()

  successResponse(res, {
    message: 'Password reset successful'
  })
})