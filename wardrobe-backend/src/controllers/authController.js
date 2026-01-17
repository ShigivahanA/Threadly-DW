import User from '../models/User.js'
import asyncHandler from '../utils/asyncHandler.js'
import AppError from '../utils/AppError.js'
import { hashPassword, comparePassword } from '../utils/password.js'
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken
} from '../utils/jwt.js'
import { successResponse } from '../utils/response.js'
import crypto from 'crypto'
import { UAParser } from 'ua-parser-js'


/**
 * @desc    Register new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = asyncHandler(async (req, res) => {
  const { email, password, name } = req.body

  if (!email || !password) {
    throw new AppError('Email and password are required', 400)
  }

  const existingUser = await User.findOne({ email })
  if (existingUser) {
    throw new AppError('User already exists', 409)
  }

  const hashedPassword = await hashPassword(password)

  const user = await User.create({
    email,
    password: hashedPassword,
    name
  })

const refreshTokenId = crypto.randomUUID()

const accessToken = generateAccessToken({
  userId: user._id,
  sid: refreshTokenId
})

const refreshToken = generateRefreshToken({
  userId: user._id,
  sid: refreshTokenId
})

const parser = new UAParser(req.headers['user-agent'])
const ua = parser.getResult()

user.sessions.push({
  refreshTokenId,
  device: `${ua.browser.name || 'Browser'} · ${ua.os.name || 'OS'}`,
  ip: req.ip
})

await user.save()


  successResponse(res, {
    statusCode: 201,
    message: 'User registered successfully',
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

/**
 * @desc    Get current authenticated user
 * @route   GET /api/auth/me
 * @access  Private
 */
export const me = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id)

  if (!user) {
    throw new AppError('User not found', 404)
  }

  successResponse(res, {
    data: {
      user: {
        id: user._id,
        email: user.email,
        name: user.name
      }
    }
  })
})



/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    throw new AppError('Email and password are required', 400)
  }

  const user = await User.findOne({ email }).select('+password')
  if (!user) {
    throw new AppError('Invalid credentials', 401)
  }

  const isMatch = await comparePassword(password, user.password)
  if (!isMatch) {
    throw new AppError('Invalid credentials', 401)
  }

  const refreshTokenId = crypto.randomUUID()

const parser = new UAParser(req.headers['user-agent'])
const ua = parser.getResult()

const device =
  `${ua.browser.name || 'Browser'} · ${ua.os.name || 'OS'}`

const accessToken = generateAccessToken({
  userId: user._id,
  sid: refreshTokenId
})

const refreshToken = generateRefreshToken({
  userId: user._id,
  sid: refreshTokenId
})

user.sessions.push({
  refreshTokenId,
  device,
  ip: req.ip
})

await user.save()

  successResponse(res, {
    message: 'Login successful',
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

/**
 * @desc    Refresh access token
 * @route   POST /api/auth/refresh
 * @access  Public
 */
export const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body
  if (!refreshToken) {
    throw new AppError('Refresh token required', 400)
  }

  let decoded
  try {
    decoded = verifyRefreshToken(refreshToken)
  } catch {
    throw new AppError('Invalid refresh token', 401)
  }

  const user = await User.findById(decoded.userId)
  if (!user) {
    throw new AppError('Invalid refresh token', 401)
  }

  const session = user.sessions.find(
    s => s.refreshTokenId === decoded.sid
  )

  if (!session) {
    throw new AppError('Session expired', 401)
  }

  session.lastActiveAt = new Date()
  await user.save()

  const newAccessToken = generateAccessToken({
    userId: user._id,
    sid: decoded.sid
  })

  successResponse(res, {
    message: 'Access token refreshed',
    data: {
      accessToken: newAccessToken,
      refreshToken
    }
  })
})


/**
 * @desc    Logout user
 * @route   POST /api/auth/logout
 * @access  Private
 */
export const logout = asyncHandler(async (req, res) => {
  await User.updateOne(
  { _id: req.user.id },
  { $pull: { sessions: { refreshTokenId: req.user.sessionId } } }
)


  successResponse(res, {
    message: 'Logged out successfully',
    data: null
  })
})
