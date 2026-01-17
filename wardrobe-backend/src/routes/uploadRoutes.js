import express from 'express'
import auth from '../middleware/auth.js'
import { getUploadSignature } from '../controllers/uploadController.js'

const router = express.Router()

router.post('/signature', auth, getUploadSignature)

export default router
