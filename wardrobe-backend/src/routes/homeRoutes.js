import express from 'express'
import auth from '../middleware/auth.js'
import { getHomeData } from '../controllers/homeController.js'

const router = express.Router()

router.get('/', auth, getHomeData)

export default router
