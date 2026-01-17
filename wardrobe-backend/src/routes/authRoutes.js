import express from 'express'
import { register, login, refreshToken, logout, me  } from '../controllers/authController.js'
import validate from '../middleware/validate.js'
import {
  requestOtp,
  verifyOtp
} from '../controllers/authOtpController.js'
import {
  forgotPassword,
  resetPassword
} from '../controllers/authPasswordController.js'
import { authLimiter } from '../middleware/rateLimit.js'
import { z } from 'zod'
import auth from '../middleware/auth.js'

const router = express.Router()

const registerSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().optional()
  })
})

const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string()
  })
})

const refreshSchema = z.object({
  body: z.object({
    refreshToken: z.string()
  })
})

router.post(
  '/register',
  authLimiter,
  validate(registerSchema),
  register
)

router.post(
  '/login',
  authLimiter,
  validate(loginSchema),
  login
)

router.post(
  '/refresh',
  validate(refreshSchema),
  refreshToken
)

router.post('/logout', auth, logout)

router.post('/otp/request', requestOtp)
router.post('/otp/verify', verifyOtp)
router.post('/password/forgot', forgotPassword)
router.post('/password/reset', resetPassword)
router.get('/me', auth, me)


export default router
