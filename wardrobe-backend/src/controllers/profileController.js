import asyncHandler from '../utils/asyncHandler.js'
import { successResponse } from '../utils/response.js'
import AppError from '../utils/AppError.js'
import { exportUserDataAndEmail } from '../utils/exportUserData.js'
import User from '../models/User.js'
import WardrobeItem from '../models/WardrobeItem.js'
import Outfit from '../models/Outfit.js'
import { otpEmail,changePasswordOtpEmail } from '../utils/emailTemplates.js'
import { passwordChangedEmail } from '../utils/emailTemplates.js'
import { generateOtp, hashOtp, compareOtp } from '../utils/otp.js'
import { sendEmail } from '../utils/mailer.js'
import { hashPassword,comparePassword } from '../utils/password.js'


/* ======================
   Get profile
====================== */
export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id)
    .select('name email createdAt sessions')
    .lean()

  successResponse(res, {
    message: 'Profile fetched',
    data: {
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      sessions: user.sessions.map(s => ({
        id: s._id,
        device: s.device,
        ip: s.ip,
        lastActiveAt: s.lastActiveAt
      }))
    }
  })
})


/* ======================
   Update profile
====================== */
export const updateProfile = asyncHandler(async (req, res) => {
  const { name } = req.body

  const user = await User.findById(req.user.id)
  if (!user) {
    throw new AppError('User not found', 404)
  }

  if (name && name.trim()) {
    user.name = name.trim()
  }

  await user.save()

  successResponse(res, {
    message: 'Profile updated',
    data: {
      name: user.name,
      email: user.email
    }
  })
})

/* ======================
   Export user data
   (stub – async email later)
====================== */
export const exportProfileData = asyncHandler(async (req, res) => {
  successResponse(res, {
    message: 'Export request received. You will receive an email shortly.',
    data: null
  })

  // fire & forget
  exportUserDataAndEmail(req.user.id).catch(err =>
    console.error('Export failed:', err)
  )
})

/* ======================
   Delete account (cascade)
====================== */
export const deleteAccount = asyncHandler(async (req, res) => {
  const userId = req.user.id

  // Delete wardrobe items
  await WardrobeItem.deleteMany({ userId })

  // Delete outfits
  await Outfit.deleteMany({ userId })

  // Delete user
  await User.findByIdAndDelete(userId)

  successResponse(res, {
    message: 'Account deleted',
    data: null
  })
})


/* ======================
   Terminate a session
====================== */
export const terminateSession = asyncHandler(async (req, res) => {
  const { sessionId } = req.params

  // Prevent killing current session via API
  if (sessionId === req.user.sessionId) {
    throw new AppError('Cannot terminate current session', 400)
  }

  await User.updateOne(
    { _id: req.user.id },
    { $pull: { sessions: { _id: sessionId } } }
  )

  successResponse(res, {
    message: 'Session terminated',
    data: null
  })
})


/* ======================
   Request password change OTP
====================== */
export const requestPasswordOtp = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id)
  if (!user) throw new AppError('User not found', 404)

  const otp = generateOtp()

  user.otp = {
    code: hashOtp(otp),
    expiresAt: new Date(Date.now() + 5 * 60 * 1000)
  }

  await user.save()

  const email = changePasswordOtpEmail(otp)
  await sendEmail({
    to: user.email,
    subject: email.subject,
    html: email.html,
    text: email.text
  })

  successResponse(res, {
    message: 'OTP sent to your email'
  })
})

/**
 * POST /profile/password/change
 */
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword, otp } = req.body

  if (!currentPassword || !newPassword || !otp) {
    throw new AppError('All fields are required', 400)
  }

  const user = await User.findById(req.user.id).select('+password')
  if (!user) throw new AppError('User not found', 404)

  const passwordOk = await comparePassword(currentPassword, user.password)
  if (!passwordOk) throw new AppError('Incorrect current password', 401)

  const otpValid =
  user.otp &&
  user.otp.expiresAt > new Date() &&
  compareOtp(otp, user.otp.code)

if (!otpValid) {
  throw new AppError('Invalid or expired OTP', 401)
}

// 🔐 invalidate OTP immediately
user.otp = undefined
  user.password = await hashPassword(newPassword)
  user.sessions = [] // 🔥 log out all devices

  user.auditLogs.push({
  action: 'PASSWORD_CHANGED',
  ip: req.ip,
  device: req.headers['user-agent']
})

  await user.save()

  
const email = passwordChangedEmail()
await sendEmail({
  to: user.email,
  subject: email.subject,
  html: email.html,
  text: email.text
})

  successResponse(res, {
    message: 'Password changed successfully'
  })
})