import User from '../models/User.js'
import asyncHandler from '../utils/asyncHandler.js'
import AppError from '../utils/AppError.js'
import { generateOtp, hashOtp } from '../utils/otp.js'
import { hashPassword, comparePassword } from '../utils/password.js'
import {
  generateAccessToken,
  generateRefreshToken
} from '../utils/jwt.js'
import { successResponse } from '../utils/response.js'
import { sendEmail } from '../utils/mailer.js'
import { otpEmail } from '../utils/emailTemplates.js'
import crypto from 'crypto'
import { UAParser } from 'ua-parser-js'


/**
 * POST /api/auth/otp/request
 */
export const requestOtp = asyncHandler(async (req, res) => {
  const { email } = req.body

  if (!email) {
    throw new AppError('Email is required', 400)
  }

  const user = await User.findOne({ email })
  if (!user) {
    return successResponse(res, {
      message: 'If the email exists, OTP has been sent'
    })
  }

  const otp = generateOtp()
  const hashedOtp = hashOtp(otp)

  user.otp = {
    code: hashedOtp,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000)
  }

  await user.save()

  // ✅ SEND EMAIL
  const emailContent = otpEmail(otp)
  await sendEmail({
    to: email,
    subject: emailContent.subject,
    html: emailContent.html,
    text: emailContent.text
  })

  successResponse(res, {
    message: 'OTP sent to email'
  })
})

/**
 * POST /api/auth/otp/verify
 */
/**
 * POST /api/auth/otp/verify
 */
export const verifyOtp = asyncHandler(async (req, res) => {
  let { email, otp } = req.body

  if (!email || !otp) {
    throw new AppError('Email and OTP required', 400)
  }

  const normalizedEmail = email.toLowerCase().trim()
  const cleanOtp = otp.replace(/\s+/g, '').trim()

  const user = await User.findOne({ email: normalizedEmail }).select('+refreshToken')
  if (!user || !user.otp?.code) {
    throw new AppError('Invalid or expired OTP', 401)
  }

  if (user.otp.expiresAt < new Date()) {
    user.otp = undefined
    await user.save()
    throw new AppError('OTP expired', 401)
  }

  const hashed = hashOtp(cleanOtp)
  if (hashed !== user.otp.code) {
    throw new AppError('Invalid OTP', 401)
  }

  // ✅ Clear OTP
  user.otp = undefined

  const refreshTokenId = crypto.randomUUID()

const parser = new UAParser(req.headers['user-agent'])
const ua = parser.getResult()

user.sessions.push({
  refreshTokenId,
  device: `${ua.browser.name || 'Browser'} · ${ua.os.name || 'OS'}`,
  ip: req.ip
})

const accessToken = generateAccessToken({
  userId: user._id,
  sid: refreshTokenId
})

const refreshToken = generateRefreshToken({
  userId: user._id,
  sid: refreshTokenId
})

await user.save()


  successResponse(res, {
    message: 'OTP login successful',
    data: {
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        email: user.email,
        name: user.name
      }
    }
  })
})
