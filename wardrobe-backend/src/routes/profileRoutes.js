import express from 'express'
import auth from '../middleware/auth.js'
import {
  getProfile,
  updateProfile,
  exportProfileData,
  deleteAccount,
  terminateSession,
  requestPasswordOtp,
  changePassword
} from '../controllers/profileController.js'

const router = express.Router()

router.use(auth)

router.get('/', getProfile)
router.patch('/', updateProfile)
router.post('/export', exportProfileData)
router.delete('/', deleteAccount)
router.post('/password/otp', requestPasswordOtp)
router.post('/password/change', changePassword)
router.delete('/sessions/:sessionId', terminateSession)


export default router
